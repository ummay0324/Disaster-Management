import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  // model: 'googleai/gemini-2.5-flash', // We will let the flow decide the model
});
