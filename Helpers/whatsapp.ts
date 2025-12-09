import { client } from "../core/client.js";

export const sendMessage = (to: string, message: string) => {
  client.sendMessage(to, message);
};
