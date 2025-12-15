import WAWebJS from "whatsapp-web.js";
import { groq, client2, client3 } from "../core/qroqClient.js";
import { toolRegistry } from "../utils/tool_registry.js";
import type { ChatCompletionTool } from "openai/resources/index.mjs";

const conversationHistory: { [key: string]: any[] } = {};

const tools = Object.entries(toolRegistry).map(([name, data]) => ({
  type: "function" as const,
  function: {
    name,
    description: data.description,
    parameters: data.parameters,
  },
}));

export const completion = async (
  msg: WAWebJS.Message,
  toolContext?: { toolName: string; toolResult: any }
) => {
  try {
    const userId = msg.from;

    if (!conversationHistory[userId]) {
      conversationHistory[userId] = [];
    }

    // Store the user's message
    if (msg.body) {
      conversationHistory[userId].push({
        role: "user",
        content: msg.body,
      });
    }

    // Filter out any messages with undefined/empty content
    const validMessages = conversationHistory[userId].filter(
      (m) => m.content !== undefined && m.content !== null && m.content !== ""
    );

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a fun and interactive WhatsApp game bot that plays games and can have interesting conversations. SOUND LIKE A HUMAN WOULD, not like an AI.
                      Your job is to always guide the player through the game step by step, never skipping ahead.
                      **IMPORTANT:** Only mention and offer the games/tools listed below. Do NOT suggest, hint at, or mention any other games, options, or "something else". 
                      Never use phrases like "or a different game", "or something else", or "let me know if you want to play another game". 
                      If the user asks for a game not listed, politely say you only offer the games below.
                      Here are the games/tools you can offer:
                      Truth_or_dare, picture_questions, quiz_game.
                      BUT Don't mention tools or functions that are not games.
                      Always keep the conversation engaging and lively. Be fun and sarcastic sometimes, have a personality.
                      **When playing Truth or Dare, always ask the user to choose "truth" or "dare" before sending a question. Only send a truth if they choose truth, and only send a dare if they choose dare. Never swap or guess for them.**
                      **when playing quiz games, always give use the send_whatsapp_message tool to give the correct answer to the previous quiz question before moving on to the next question.**
                      If the user is indecisive or asks about the conversation, you can make a playful suggestion, pick a game for them, or answer their question. Don't just repeat the options endlessly.`,
        },
        ...validMessages,
      ],
      model: "openai/gpt-oss-120b",
      tools: toolContext ? undefined : tools,
      tool_choice: toolContext ? undefined : "auto",
      temperature: 0.8,
    });

    const assistantMessage = response.choices[0]?.message;

    if (assistantMessage) {
      // simple chweck to fix the typescript error

      conversationHistory[userId].push({
        role: "assistant",
        content:
          assistantMessage.content ||
          assistantMessage.tool_calls?.[0]?.function.arguments ||
          "hmm",
        tool_calls: assistantMessage.tool_calls ?? [],
      });
    }

    // console.log(conversationHistory);

    // console.log("conversation History", conversationHistory, "The end ");
    // console.log(response.choices[0]?.message);
    return response;
  } catch (error) {
    console.error("Error in completion:", error);
    return null;
  }
};
