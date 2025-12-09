import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

export const boot = (client: Client) => {
  client.on("code", (code) => {
    console.log("Use this Pairing code:", code);
    console.log("\n or use the qr code generated below");
  });
  client.on("qr", (qr) => {
    console.log("Scan this QR code on your phone to connect:");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is connected and ready to be used!");
  });
  client.initialize();
};
