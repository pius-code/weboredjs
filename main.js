import { client } from "./core/client.js";
import { boot } from "./services/boot.js";
import Groq from "groq-sdk";
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

boot(client);

client.on("message", async (msg) => {
  console.log(msg.from);
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a game bot. When the user asks for a mode, respond using a tool call ONLY. " +
          "Available tools: send_whatsapp_message(text). " +
          'Format: <tool name="TOOL_NAME">{"param": "value"}</tool> Do NOT respond with anything else.',
      },
      {
        role: "user",
        content: "How many years does it take to get to Jupiter?",
      },
    ],
    model: "openai/gpt-oss-20b",
    tools: [
      {
        type: "function",
        function: {
          name: "send_whatsapp_message",
          description: "Send a message back to WhatsApp",
          parameters: {
            type: "object",
            properties: {
              text: { type: "string" },
            },
            required: ["text"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });
  console.log(completion.choices[0]?.message?.content || "");
  const response = completion.choices[0].message;
  if (response.tool_calls) {
    for (const tool of response.tool_calls) {
      if (tool.function.name === "send_whatsapp_message") {
        const args = JSON.parse(tool.function.arguments);
        client.sendMessage("233536287642@c.us", args.text);
      }
    }
  }
  if (msg.body === "!ping") {
    msg.reply("pong");
  }
});
