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

export const checkIsGroup = async (msg: WAWebJS.Message) => {
  const chat = await msg.getChat();
  if (chat.isGroup) {
    return "Yes This message is from a group";
  } else {
    return "No, This message is not from a group";
  }
};

export const getParticipantNames = async (msg: WAWebJS.Message) => {
  try {
    const chat = await msg.getChat();
    if (!chat.isGroup) {
      throw new Error("Not a group");
    }

    const groupChat = chat as WAWebJS.GroupChat;
    const participants = groupChat.participants;

    const participantNames = await Promise.all(
      participants.map(async (participant) => {
        try {
          const contact = await client.getContactById(
            participant.id._serialized
          );
          return {
            name:
              contact.pushname ||
              contact.name ||
              contact.number ||
              participant.id.user,
            number: participant.id.user,
          };
        } catch {
          return {
            name: participant.id.user,
            number: participant.id.user,
          };
        }
      })
    );

    console.log(participantNames);
    return participantNames;
  } catch (error) {
    console.error("Error getting group participants:", error);
    throw error;
  }
};
