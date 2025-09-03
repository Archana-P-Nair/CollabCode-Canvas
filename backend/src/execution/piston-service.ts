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
      version: getLanguageVersion(language), // Add version based on language
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
      memory: '1KB' // Placeholder; Piston doesn't provide memory
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    return {
      output: errorMessage,
      status: 'Error',
      time: '0.01s',
      memory: '1KB'
    };
  }
};

// Helper function to map languages to versions
function getLanguageVersion(language: string): string {
  const versions: { [key: string]: string } = {
    python: '3.10',
    cpp: '14',
    java: '17',
    c: '11'
  };
  return versions[language] || 'latest'; // Default to 'latest' if unsupported
}
