export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

export class CodeExecutor {
  static async executeJavaScript(code: string, testInput?: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      const { NodeVM } = require('vm2');
      let output: string[] = [];
      const vm = new NodeVM({ timeout: 5000, sandbox: {}, console: 'redirect' });
      vm.on('console.log', (...args: any[]) => { output.push(args.join(' ')); });
      vm.run(code);
      return { 
        success: true, 
        output: output.join('\n') || 'Code ran successfully (no output)', 
        executionTime: Date.now() - startTime 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message, 
        executionTime: Date.now() - startTime 
      };
    }
  }

  static async executePython(code: string, testInput?: string): Promise<ExecutionResult> {
    return {
      success: false,
      error: 'Python execution coming soon! For now, use JavaScript or TypeScript.',
      executionTime: 0
    };
  }

  static async executeTypeScript(code: string, testInput?: string): Promise<ExecutionResult> {
    return this.executeJavaScript(code, testInput);
  }
}
