import { client } from "./core/client.js";
import { boot } from "./services/boot.js";
import { completion } from "./Helpers/qroq.ts";
import { tool_handler } from "./Handlers/tools.ts";

boot(client);

client.on("message", async (msg) => {
  if (msg.from === "status@broadcast") {
    return;
  }

  if (msg.fromMe) {
    return;
  }

  const chat = await msg.getChat();

  if (msg.from === "233536287642@c.us") {
    console.log("message from user:", msg.body);
    const response = await completion(msg);
    console.log("completion response:", response);
    await tool_handler(response, msg);
  }
});
