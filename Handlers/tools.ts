import { client } from "../core/client.js";
import { execute_tool } from "../utils/tool_registry.js";
import WAWebJS from "whatsapp-web.js";
import { completion } from "../Helpers/qroq.js";
import { sendTyping } from "../Helpers/whatsapp.js";
import { clearState } from "../Helpers/whatsapp.js";

export const tool_handler = async (response: any, msg: WAWebJS.Message) => {
  const toolCalls = response?.choices?.[0]?.message?.tool_calls;

  if (toolCalls && toolCalls.length > 0) {
    for (const tool of toolCalls) {
      const args = JSON.parse(tool.function.arguments);
      await execute_tool(tool.function.name, args, msg);
    }
  } else {
    console.log("run the else in tools.ts");
    await sendTyping(msg);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const text = response?.choices?.[0]?.message?.content;
    if (text) {
      await msg.reply(text || "Sorry, I couldn't process that.");
    } else {
      await msg.reply("Sorry, I couldn't process that.");
    }
    await clearState(msg);
  }
};
