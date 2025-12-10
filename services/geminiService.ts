import { GoogleGenAI } from "@google/genai";
import { ChatMessage, UserState } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction to define the Cat persona
const SYSTEM_INSTRUCTION = `
Eres un asistente virtual con forma de gato gris atigrado (tabby).
Tu nombre es "Michi".
Tu personalidad es amable, motivadora, un poco juguetona y muy sabia.
Hablas español.

Tus objetivos son:
1. Ayudar al usuario a organizar su tiempo y cumplir sus tareas.
2. Motivar al usuario cuando no cumple sus tareas (no regañar, sino animar).
3. Celebrar los logros del usuario cuando gana puntos.
4. Escuchar al usuario si quiere desahogarse o contar cómo se siente.

Contexto actual del usuario:
- El usuario gana puntos por cumplir tareas y hábitos.
- Si el usuario pregunta cosas complejas, PIENSA profundamente antes de responder.
`;

export const sendMessageToGemini = async (
  message: string,
  history: ChatMessage[],
  userState: UserState
): Promise<string> => {
  try {
    // Construct context about the user's current status
    const pendingTasks = userState.tasks.filter(t => !t.completed).length;
    const completedTasks = userState.tasks.filter(t => t.completed).length;
    const points = userState.points;
    const mode = userState.mode;
    
    const dynamicContext = `
    [Contexto del Sistema]
    Usuario: ${userState.name}
    Modo: ${mode}
    Puntos actuales: ${points}
    Tareas pendientes hoy: ${pendingTasks}
    Tareas completadas hoy: ${completedTasks}
    Accesorio del gato: ${userState.accessory}
    `;

    // Convert internal history to Gemini format
    // We limit history to last 10 turns to save tokens, though Gemini 1.5/2.0 has huge context
    const chatHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Add dynamic context as a system-like message at the start of the chat for this turn
    // Ideally we put this in systemInstruction, but adding it to the prompt ensures freshness
    const contents = [
      ...chatHistory,
      {
        role: 'user',
        parts: [{ text: `${dynamicContext}\n\n${message}` }]
      }
    ];

    const model = 'gemini-3-pro-preview';

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: {
          thinkingBudget: 32768 // Max thinking budget for complex reasoning
        }
      }
    });

    return response.text || "Miau... me quedé dormido. Intenta de nuevo.";

  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Lo siento, tuve un problema conectando con mi cerebro gatuno. ¿Revisaste tu conexión?";
  }
};
