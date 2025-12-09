client.initialize(); // Start the client
client.destroy(); // Close the client
client.logout(); // Logout from WhatsApp

// Send text message
client.sendMessage(chatId, "Hello!");

// Send media
client.sendMessage(chatId, media, { caption: "Check this out!" });

// Send location
client.sendMessage(chatId, new Location(latitude, longitude, "Location name"));

// Send contact
client.sendMessage(chatId, contact);

client.getChats(); // Get all chats
client.getChatById(chatId); // Get specific chat
client.getContacts(); // Get all contacts
client.getContactById(contactId); // Get specific contact
client.getNumberId(number); // Check if number is on WhatsApp
client.createGroup(name, [participants]); // Create a group

client.getChats(); // Get all chats
client.getChatById(chatId); // Get specific chat
client.getContacts(); // Get all contacts
client.getContactById(contactId); // Get specific contact
client.getNumberId(number); // Check if number is on WhatsApp
client.createGroup(name, [participants]); // Create a group

client.getState(); // Get connection state
client.getProfilePicUrl(contactId); // Get profile picture URL
client.setStatus("My status"); // Set your status
client.setDisplayName("Name"); // Set display name

client.on("qr", (qr) => {}); // QR code received
client.on("ready", () => {}); // Client is ready
client.on("authenticated", () => {}); // Authenticated successfully
client.on("auth_failure", (msg) => {}); // Authentication failed
client.on("disconnected", (reason) => {}); // Client disconnected
client.on("message", (msg) => {}); // New message received
client.on("message_create", (msg) => {}); // Message created (sent or received)
client.on("message_ack", (msg, ack) => {}); // Message status changed
client.on("group_join", (notification) => {}); // Someone joined group
client.on("group_leave", (notification) => {}); // Someone left group

msg.id; // Message ID
msg.body; // Message text
msg.from; // Sender ID
msg.to; // Recipient ID
msg.timestamp; // Timestamp
msg.isGroupMsg; // Is group message?
msg.hasMedia; // Has media attachment?
msg.type; // Message type (text, image, video, etc.)

msg.reply("Hello!"); // Reply to message
msg.react("👍"); // React to message
msg.delete(true); // Delete message for everyone
msg.downloadMedia(); // Download attached media
msg.forward(chatId); // Forward message
msg.getChat(); // Get chat object
msg.getContact(); // Get sender contact
msg.getQuotedMessage(); // Get quoted message (if reply)

chat.sendMessage("Hello!"); // Send message to chat
chat.sendSeen(); // Mark as read
chat.clearMessages(); // Clear chat
chat.delete(); // Delete chat
chat.archive(); // Archive chat
chat.unarchive(); // Unarchive chat
chat.pin(); // Pin chat
chat.unpin(); // Unpin chat
chat.mute(); // Mute chat
chat.unmute(); // Unmute chat
chat.getContact(); // Get contact info
chat.fetchMessages({ limit: 50 }); // Fetch message history
