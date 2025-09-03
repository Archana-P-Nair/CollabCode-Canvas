import axios from 'axios';

export const executeCode = async (code: string, language: string, stdin: string): Promise<{
  output: string;
  status: string;
  time: string;
  memory: string;
}> => {
  try {
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language,
      source: code,
      stdin
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const { run: { output, stdout, stderr, code: exitCode, signal, time } } = response.data;
    const finalOutput = stdout || stderr || `Exited with code ${exitCode}${signal ? `, signal: ${signal}` : ''}`;
    return {
      output: finalOutput,
      status: exitCode === 0 ? 'Success' : 'Error',
      time: `${time || 0}ms`,
      memory: '1KB' 
    };
  } catch (error) {
    return {
      output: error.response?.data?.message || error.message,
      status: 'Error',
      time: '0.01s',
      memory: '1KB'
    };
  }
};
