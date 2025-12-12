import { client } from "./core/client.js";
import { boot } from "./services/boot.js";
import { completion } from "./Helpers/qroq.ts";
import { tool_handler } from "./Handlers/tools.ts";

boot(client);

const ALLOWED_GROUP = "120363424142322037@g.us";

client.on("message", async (msg) => {
  if (msg.from === "status@broadcast") return;
  if (msg.fromMe) return;

  const chat = await msg.getChat();

  // Only process messages from the allowed group
  if (msg.from !== ALLOWED_GROUP) return;

  // Check if message mentions "bot"
  const mentionsBot =
    msg.body.toLowerCase().includes("bot") ||
    msg.body.includes("@bot") ||
    msg.body.includes("@Bot");

  // Check if message is a reply to bot's message
  let isReplyToBot = false;
  if (msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    isReplyToBot = quotedMsg.fromMe;
  }

  if (mentionsBot) {
    console.log(`Processing message from ${msg.from}`);
    console.log(`Mentions bot: ${mentionsBot}, Reply to bot: ${isReplyToBot}`);

    const response = await completion(msg);
    await tool_handler(response, msg);
  }
});
