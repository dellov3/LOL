import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, TeamComposition, Lane } from '../types';

const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
}

// New function to generate the team using AI
export const generateMetaTeam = async (): Promise<Record<string, string> | null> => {
  if (!ai) return null;

  const prompt = `
    Generate a random, valid League of Legends team composition for Summoner's Rift (5v5).
    The team must follow the standard meta lanes: Top, Jungle, Mid, Bot (ADC), Support.
    
    Pick champions that are currently viable or meta in these roles (Season 14/15).
    Ensure the team has a reasonable mix of damage types (AD/AP) and tankiness.
    
    Return ONLY a JSON object where the keys are the lanes (TOP, JUNGLE, MID, BOT, SUPPORT) 
    and the values are the exact English names of the champions.
    
    Example: { "TOP": "Ornn", "JUNGLE": "Viego", "MID": "Ahri", "BOT": "Jinx", "SUPPORT": "Thresh" }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            TOP: { type: Type.STRING },
            JUNGLE: { type: Type.STRING },
            MID: { type: Type.STRING },
            BOT: { type: Type.STRING },
            SUPPORT: { type: Type.STRING }
          },
          required: ["TOP", "JUNGLE", "MID", "BOT", "SUPPORT"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Team Generation Failed:", error);
    return null;
  }
};

export const analyzeTeamComposition = async (team: TeamComposition): Promise<AnalysisResult | null> => {
  if (!ai) {
    console.warn("Gemini API Key not found.");
    return null;
  }

  const teamString = `
    Top: ${team[Lane.TOP]?.name || 'Unknown'}
    Jungle: ${team[Lane.JUNGLE]?.name || 'Unknown'}
    Mid: ${team[Lane.MID]?.name || 'Unknown'}
    Bot/ADC: ${team[Lane.BOT]?.name || 'Unknown'}
    Support: ${team[Lane.SUPPORT]?.name || 'Unknown'}
  `;

  const prompt = `
    Analyze this League of Legends team composition based on the current meta (Season 14/15).
    Team: ${teamString}
    
    Provide a retro-arcade style analysis.
    Return strictly valid JSON matching this schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            teamName: { type: Type.STRING, description: "A cool, retro arcade name for this team (e.g., 'Pixel Brawlers')" },
            rating: { type: Type.INTEGER, description: "A rating from 1 to 10" },
            winCondition: { type: Type.STRING, description: "One sentence describing how they win" },
            weakness: { type: Type.STRING, description: "One sentence describing their fatal flaw" }
          },
          required: ["teamName", "rating", "winCondition", "weakness"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return null;
  }
};