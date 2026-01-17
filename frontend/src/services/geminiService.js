import { GoogleGenAI } from "@google/genai";

// Ideally, this should be an environment variable. 
// For now, checking if we can use a placeholder or if user needs to supply it. 
// The reference code used 'process.env.API_KEY'. 
// We will use a safe fallback or empty string.
const API_KEY = ""; 

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getNarrative = async (
  playerName,
  event,
  rollValue,
  fromPos,
  toPos
) => {
  if (!API_KEY) return "The mist is too thick to see the fates clearly. (Missing API Key)";

  try {
    const prompt = `You are a mystical, slightly dramatic game master narrating a game of Snakes and Ladders.
    Keep it short (max 2 sentences), atmospheric, and punchy.
    Event: ${event}
    Player: ${playerName}
    Details: ${event === 'roll' ? `rolled a ${rollValue}` : event === 'snake' ? `fell from ${fromPos} to ${toPos}` : event === 'ladder' ? `climbed from ${fromPos} to ${toPos}` : 'won the game'}.
    Inject fantasy flavor (mention dragons, cosmic shifts, ancient stairs, or slippery vipers).`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.9,
        maxOutputTokens: 100,
      }
    });

    return response.response.text() || "The fates shift silently...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The stars are cloudy tonight.";
  }
};
