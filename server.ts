import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API route for AI-assisted custom clause analysis and negotiation advice
app.post('/api/ai/analyze-clause', async (req, res) => {
  try {
    const { clauseText, clauseTitle, perspective = 'balanced' } = req.body;

    if (!clauseText || typeof clauseText !== 'string') {
      return res.status(400).json({ error: 'clauseText is required and must be a string' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the server environment.',
        fallbackAvailable: true
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a senior contract lawyer and commercial transactions expert. Analyze the following contract clause from an illustrative service agreement:
Clause Title: ${clauseTitle || 'Contract Clause'}
Clause Text: "${clauseText}"
Requested Negotiating Perspective: ${perspective} (either 'balanced', 'client_friendly', or 'provider_friendly')

Provide a structured JSON response with the following fields:
{
  "riskRating": "Critical" | "High" | "Medium" | "Low",
  "summaryRisk": "1-2 sentence executive summary of key danger",
  "ambiguities": ["3-5 specific bullet points detailing legal ambiguities, missing terms, undefined metrics, or procedural holes"],
  "partyRisks": {
    "client": "Specific risks for the client / buyer",
    "provider": "Specific risks for the service provider / vendor"
  },
  "legalDoctrines": ["Relevant common law / statutory doctrines, e.g. mutuality of obligation, indemnity strict liability, unconscionability, proximate cause, UCC, etc."],
  "balancedRedline": "Full suggested revised clause text written in clear, balanced standard commercial language",
  "keyChangesExplanation": ["3-4 bullet points explaining why the balanced redline solves the risks"],
  "negotiationTactics": "Actionable negotiation script and fallback compromise position"
}

Return ONLY valid JSON without extra markdown wrapping.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      return res.status(500).json({ error: 'Empty response from Gemini model' });
    }

    const parsed = JSON.parse(responseText);
    return res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error analyzing clause with Gemini:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to complete AI clause analysis',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// Dev and Prod Vite server mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
