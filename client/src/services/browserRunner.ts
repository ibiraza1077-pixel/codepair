import type { ExecutionResult } from './executionTypes';

const MAX_CODE_LENGTH = 32_000;
const MAX_OUTPUT_LENGTH = 64_000;
const RUN_TIMEOUT_MS = 5_000;

// The submitted code only enters this worker, which is created by an opaque-origin
// sandboxed frame. The frame's CSP blocks network connections and external scripts.
const WORKER_SOURCE = `
self.onmessage = async ({ data }) => {
  let output = '';
  const write = (...values) => {
    const line = values.map(value => {
      if (typeof value === 'string') return value;
      try { return JSON.stringify(value) ?? String(value); }
      catch { return String(value); }
    }).join(' ') + '\\n';
    output += line;
    if (output.length > ${MAX_OUTPUT_LENGTH}) throw new Error('Output exceeded 64000 characters.');
  };
  const capturedConsole = { log: write, info: write, warn: write, error: write };
  try {
    const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
    await new AsyncFunction('console', data.code)(capturedConsole);
    self.postMessage({ success: true, output: output || 'Code ran successfully (no output)' });
  } catch (error) {
    self.postMessage({ success: false, error: String(error) });
  }
};`;

function sandboxDocument(parentOrigin: string): string {
  const workerSource = JSON.stringify(WORKER_SOURCE).replace(/</g, '\\u003c');
  const allowedOrigin = JSON.stringify(parentOrigin).replace(/</g, '\\u003c');
  return `<!doctype html><html><head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'; img-src 'none'; media-src 'none'; font-src 'none'; style-src 'none'; object-src 'none'; form-action 'none'; base-uri 'none'">
    </head><body><script>
    const workerSource = ${workerSource};
    let started = false;
    addEventListener('message', event => {
      if (started || event.source !== parent || event.origin !== ${allowedOrigin} || event.data?.type !== 'run') return;
      started = true;
      const { code, runId } = event.data;
      try {
        const url = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));
        const worker = new Worker(url);
        URL.revokeObjectURL(url);
        worker.onmessage = ({ data }) => {
          parent.postMessage({ type: 'result', runId, result: data }, ${allowedOrigin});
          worker.terminate();
        };
        worker.onerror = () => {
          parent.postMessage({ type: 'result', runId, result: { success: false, error: 'Browser runner failed.' } }, ${allowedOrigin});
          worker.terminate();
        };
        worker.postMessage({ code });
      } catch {
        parent.postMessage({ type: 'result', runId, result: { success: false, error: 'Browser sandbox is unavailable.' } }, ${allowedOrigin});
      }
    });
    </script></body></html>`;
}

export async function executeInBrowser(code: string, language: 'javascript' | 'typescript'): Promise<ExecutionResult> {
  if (!code.trim() || new TextEncoder().encode(code).length > MAX_CODE_LENGTH) {
    return { success: false, error: 'Provide between 1 and 32000 bytes of code.' };
  }

  if (language === 'typescript') {
    const ts = await import('typescript');
    const compiled = ts.transpileModule(code, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
      reportDiagnostics: true,
    });
    const errors = (compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
    if (errors.length) {
      return { success: false, error: errors.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n') };
    }
    code = compiled.outputText;
  }

  const started = Date.now();
  const runId = crypto.randomUUID();
  const iframe = document.createElement('iframe');
  iframe.sandbox.add('allow-scripts');
  iframe.referrerPolicy = 'no-referrer';
  iframe.style.display = 'none';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.srcdoc = sandboxDocument(window.location.origin);

  return new Promise<ExecutionResult>(resolve => {
    let finished = false;
    const finish = (result: ExecutionResult) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
      iframe.remove();
      resolve({ ...result, executionTime: Date.now() - started });
    };
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow || event.origin !== 'null' || event.data?.type !== 'result' || event.data.runId !== runId) return;
      const result = event.data.result;
      if (typeof result?.success !== 'boolean') return;
      if (result.success && typeof result.output === 'string' && result.output.length <= MAX_OUTPUT_LENGTH) {
        finish({ success: true, output: result.output });
      } else if (!result.success && typeof result.error === 'string') {
        finish({ success: false, error: result.error.slice(0, MAX_OUTPUT_LENGTH) });
      }
    };
    const timeout = window.setTimeout(() => finish({ success: false, error: 'Execution exceeded 5 seconds.' }), RUN_TIMEOUT_MS);
    window.addEventListener('message', onMessage);
    iframe.addEventListener('load', () => iframe.contentWindow?.postMessage({ type: 'run', runId, code }, '*'), { once: true });
    document.body.appendChild(iframe);
  });
}
