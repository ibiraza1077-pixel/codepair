import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

// Submitted code must never execute inside the API process.
export class CodeExecutor {
  private static active = 0;

  static async execute(code: string, language: string): Promise<ExecutionResult> {
    if (typeof code !== 'string' || !code.trim() || Buffer.byteLength(code) > 32000) {
      return { success: false, error: 'Provide between 1 and 32000 bytes of code.' };
    }
    if (!['javascript', 'typescript', 'python'].includes(language)) {
      return { success: false, error: 'This language is available for editing only.' };
    }
    if (process.env.ENABLE_CODE_EXECUTION !== 'true') {
      return { success: false, error: 'Code execution is not configured on this server.' };
    }
    if (this.active >= 2) return { success: false, error: 'Runner busy. Please try again.' };
    if (language === 'typescript') {
      const compiled = ts.transpileModule(code, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
        reportDiagnostics: true,
      });
      const errors = (compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
      if (errors.length) return { success: false, error: errors.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n') };
      code = compiled.outputText;
    }
    this.active++;
    const started = Date.now();
    const name = `codepair-${randomUUID()}`;
    try {
      return await new Promise<ExecutionResult>(resolve => {
        const runner = language === 'python'
          ? ['python:3.12-alpine', 'python', '-I', '-B', '-']
          : ['node:22-alpine', 'node', '-'];
        const child = spawn('docker', [
          'run', '--rm', '--pull=never', '--name', name, '--network=none',
          '--memory=96m', '--memory-swap=96m', '--cpus=0.5', '--pids-limit=32',
          '--read-only', '--cap-drop=ALL', '--security-opt=no-new-privileges',
          '--user=65534:65534', '-i', ...runner,
        ], { stdio: ['pipe', 'pipe', 'pipe'] });
        let output = '', errors = '', size = 0, done = false;
        const finish = (result: ExecutionResult, stop = false) => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          if (stop) {
            child.kill('SIGKILL');
            const cleanup = spawn('docker', ['rm', '-f', name], { stdio: 'ignore', timeout: 5000 });
            cleanup.on('error', () => {});
          }
          resolve({ ...result, executionTime: Date.now() - started });
        };
        const timer = setTimeout(() => finish({ success: false, error: 'Execution exceeded 5 seconds.' }, true), 5000);
        const collect = (chunk: Buffer, stderr: boolean) => {
          size += chunk.length;
          if (size > 64000) return finish({ success: false, error: 'Output exceeded 64000 bytes.' }, true);
          if (stderr) errors += chunk.toString(); else output += chunk.toString();
        };
        child.stdout.on('data', chunk => collect(chunk, false));
        child.stderr.on('data', chunk => collect(chunk, true));
        child.stdin.on('error', () => {});
        child.on('error', () => finish({ success: false, error: 'Docker runner is unavailable.' }));
        child.on('close', status => finish(status === 0
          ? { success: true, output: output || 'Code ran successfully (no output)' }
          : { success: false, error: status === 125 ? 'Docker runner unavailable. Check the daemon and pre-pulled images.' : errors || 'Execution failed.' }));
        child.stdin.end(code);
      });
    } finally {
      this.active--;
    }
  }
}
