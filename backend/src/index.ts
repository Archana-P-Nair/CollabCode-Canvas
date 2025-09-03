import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { executeJavaScript } from './execution/javascript-service';
import { executeCode } from './execution/piston-service'; 
import { executionLimiter } from './middleware/security';

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'https://collab-glow2-yliy.vercel.app/', // Match your frontend URL
  optionsSuccessStatus: 200 // Ensure preflight succeeds
};
app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/execute', executionLimiter, async (req, res) => {
  try {
    const { code, language, stdin = '' } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    let result;
    switch (language) {
      case 'javascript':
        result = executeJavaScript(code, stdin);
        break;
      default:
        result = await executeCode(code, language, stdin);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ 
      error: 'Execution failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;


