import { client } from "../core/client.js";
import { clearState, sendMedia } from "../Helpers/whatsapp.js";
import { sendTyping } from "../Helpers/whatsapp.js";
import WAWebJS from "whatsapp-web.js";
import { getRandomImage } from "../Helpers/cloudinary.js";

export const toolRegistry: {
  [key: string]: {
    function: (args: any) => Promise<void>;
    description: string;
    parameters: any;
  };
} = {
  send_whatsapp_message: {
    function: async (args: any) => {
      client.sendMessage("233536287642@c.us", args.text);
      console.log(`Sent message: ${args.text}`);
    },
    description: "Send a message back to WhatsApp",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
    },
  },
  picture_questions: {
    function: async (args: any) => {
      const image = await getRandomImage();
      sendMedia("233536287642@c.us", image, {
        caption: "Try this",
      });
      console.log(`Sent message: ${args.text}`);
    },
    description: "Sends a high GK image to the users",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
    },
  },
};

export const execute_tool = async (
  toolName: string,
  args: any,
  msg: WAWebJS.Message
) => {
  if (toolRegistry[toolName]) {
    await sendTyping(msg);
    await new Promise((resolve) => setTimeout(resolve, 900));
    await toolRegistry[toolName].function(args);
    await clearState(msg);
  }
};
