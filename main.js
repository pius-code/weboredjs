import { client } from "./core/client.js";
import { boot } from "./services/boot.js";
import { completion } from "./Helpers/qroq.ts";
import { tool_handler } from "./Handlers/tools.ts";

boot(client);

client.on("message", async (msg) => {
  if (msg.from === "233536287642@c.us") {
    console.log(msg.from);
    console.log(msg.body);
    const response = await completion(msg);
    tool_handler(response, msg);
  }
});
