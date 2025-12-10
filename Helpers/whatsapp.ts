import { client } from "../core/client.js";
import WAWebJS from "whatsapp-web.js";

const { MessageMedia } = WAWebJS;

export const sendMessage = (
  to: string,
  message: string,
  options?: { caption?: string }
) => {
  client.sendMessage(to, message, options);
};

export const sendMedia = async (
  to: string,
  media: string,
  options?: { caption?: string }
) => {
  try {
    const mediax = await MessageMedia.fromUrl(media, { unsafeMime: true });
    await client.sendMessage(to, mediax, options);
  } catch (error) {
    console.error(`Failed to send media from ${media}:`, error);
    await client.sendMessage(
      to,
      "Sorry, couldn't load that image. Please try again!"
    );
  }
};

export const sendTyping = async (msg: WAWebJS.Message) => {
  const chat = await msg.getChat();
  chat.sendStateTyping();
};

export const clearState = async (msg: WAWebJS.Message) => {
  const chat = await msg.getChat();
  chat.clearState();
};
