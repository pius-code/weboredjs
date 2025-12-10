import { client } from "../core/client.js";
import { execute_tool } from "../utils/tool_registry.js";
import WAWebJS from "whatsapp-web.js";

export const tool_handler = async (response: any, msg: WAWebJS.Message) => {
  if (response.choices[0].message.tool_calls) {
    for (const tool of response.choices[0].message.tool_calls) {
      const args = JSON.parse(tool.function.arguments);
      await execute_tool(tool.function.name, args, msg);
    }
  } else {
    client.sendMessage(
      "233536287642@c.us",
      response.choices[0]?.message?.content
    );
  }
};
