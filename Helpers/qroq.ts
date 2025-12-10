import WAWebJS from "whatsapp-web.js";
import { groq } from "../core/qroqClient.js";
import { toolRegistry } from "../utils/tool_registry.js";

const tools = Object.entries(toolRegistry).map(([toolName, toolData]) => ({
  type: "function",
  function: {
    name: toolName,
    description: toolData.description,
    parameters: toolData.parameters,
  },
}));

export const completion = async (msg: WAWebJS.Message) => {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "When a user asks a request, check your tools to identify whcih best could be used to complete that request and fufill the request. If you don't have tool respond with the send_whatsapp_message tool to reply to them",
      },
      {
        role: "user",
        content: msg.body,
      },
    ],
    model: "openai/gpt-oss-20b",
    tools: tools,
    tool_choice: "auto",
  });
  console.log("Completion response:");
  console.log(response.choices[0].message.tool_calls || "");
  return response;
};
