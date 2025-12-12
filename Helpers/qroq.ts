import WAWebJS from "whatsapp-web.js";
import { groq, client2, client3 } from "../core/qroqClient.js";
import { toolRegistry } from "../utils/tool_registry.js";
import type { ChatCompletionTool } from "openai/resources/index.mjs";

const conversationHistory: { [key: string]: any[] } = {};

const tools = Object.entries(toolRegistry).map(([name, data]) => ({
  type: "function",
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
  const userId = msg.from;

  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [];
  }

  if (toolContext) {
    // Tool result - ask LLM to format a response
    conversationHistory[userId].push({
      role: "user",
      content: `Tool "${toolContext.toolName}" returned: ${JSON.stringify(
        toolContext.toolResult
      )}. Format a friendly, engaging response for the user. For tools like truth or dare your respone should be about who is next or if you want to continue playing because the tool already sends the task to the user.`,
    });
  } else {
    // Normal user message - ensure content is not empty
    if (msg.body && msg.body.trim() !== "") {
      conversationHistory[userId].push({
        role: "user",
        content: msg.body,
      });
    }
  }

  // Filter out any messages with undefined/empty content
  const validMessages = conversationHistory[userId].filter(
    (m) => m.content !== undefined && m.content !== null && m.content !== ""
  );

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a fun WhatsApp game bot. When tool results are provided, format them in an engaging way for the user.",
      },
      ...validMessages,
    ],
    model: "openai/gpt-oss-20b",
    tools: toolContext ? undefined : tools,
    tool_choice: toolContext ? undefined : "auto",
  });

  const assistantMessage = response.choices[0]?.message;

  // Only push if content exists
  if (assistantMessage?.content) {
    conversationHistory[userId].push({
      role: "assistant",
      content: assistantMessage.content,
    });
  }

  return response;
};
