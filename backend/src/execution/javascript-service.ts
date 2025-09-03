import { VM } from 'vm2';

export const executeJavaScript = (code: string, stdin: string): {
  output: string;
  status: string;
  time: string;
  memory: string;
} => {
  const vm = new VM({
    timeout: 1000,
    sandbox: { stdin }
  });
  const startTime = performance.now();
  try {
    const output = vm.run(code);
    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2);
    return {
      output: output ? output.toString() : 'No output',
      status: 'Success',
      time: `${executionTime}ms`,
      memory: '1KB' 
    };
  } catch (error) {
    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2);
    return {
      output: error.message,
      status: 'Error',
      time: `${executionTime}ms`,
      memory: '1KB'
    };
  }
};
