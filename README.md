# 🎮 WebOred.js - AI-Powered WhatsApp Game Bot

> A fun, extensible WhatsApp bot that plays games with you using AI intelligence! Built with TypeScript, Groq AI, and WhatsApp Web.js

---

## 🌟 Features

✨ **AI-Powered Responses** - Uses Groq's language model to understand and respond intelligently  
🎯 **Tool-Based Architecture** - Easily extensible system for adding new games and features  
🖼️ **Media Support** - Send images and media from Cloudinary  
💬 **WhatsApp Integration** - Runs directly through WhatsApp Web  
🔄 **Real-time Processing** - Instant message handling with typing indicators  
🎲 **Multiple Games** - Picture questions, truth or dare, and more!

---

## 🚀 Quick Start

### Prerequisites

- Node.js v20+
- npm or yarn
- A WhatsApp account (for scanning QR code)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd weboredjs

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the bot
npm run dev
```

You'll see a **QR code in your terminal**. Scan it with your WhatsApp phone to connect! 📱

---

## 🏗️ Architecture

### Project Structure

```
weboredjs/
├── core/                    # Core configurations
│   ├── client.ts           # WhatsApp Web.js client setup
│   ├── qroqClient.ts       # Groq API client
│   ├── cloudinary.ts       # Cloudinary configuration
│   └── firebase.ts         # Firebase setup (optional)
│
├── Helpers/                 # Helper utilities
│   ├── qroq.ts             # AI completion logic
│   ├── cloudinary.ts       # Image fetching from Cloudinary
│   ├── whatsapp.ts         # WhatsApp message helpers
│   └── firebase.ts         # Firebase helpers (optional)
│
├── Handlers/               # Message handlers
│   └── tools.ts            # Tool execution handler
│
├── utils/                  # Utilities
│   └── tool_registry.ts    # All available tools/games defined here
│
├── services/               # Services
│   └── boot.ts             # Bot initialization
│
├── main.js                 # Entry point
└── package.json            # Dependencies
```

---

## 🔄 How It Works

### Message Flow

```
User Message (WhatsApp)
    ↓
main.js receives message
    ↓
completion() → Groq AI (uses toolRegistry)
    ↓
AI decides which tool to use
    ↓
tool_handler() executes the tool
    ↓
Response sent back to WhatsApp
```

### Example Flow

1. **User**: "Send me a picture question"
2. **Bot**: Calls `picture_questions` tool
3. **Cloudinary**: Fetches random image
4. **Bot**: Sends image with caption to WhatsApp
5. **User**: Describes the image, bot responds

---

## 🛠️ Configuration

### Environment Variables (`.env.local`)

```env
# Groq API
GROQ_API_KEY=your_groq_api_key

# Cloudinary (for images)
CLOUDINARY_PROJECT_NAME=your_project_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# Firebase (optional)
FIREBASE_API_KEY=your_firebase_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
FIREBASE_APP_ID=your_app_id
```

### Switching AI Models

Edit `Helpers/qroq.ts` and change the `model` field:

```typescript
const response = await groq.chat.completions.create({
  // ... other options ...
  model: "openai/gpt-oss-20b", // Change this
  // ... other options ...
});
```

**Available models:**

- `openai/gpt-oss-20b` (default - fast & free)
- `claude-3-5-sonnet-20241022`
- `llama-3.1-70b-versatile`
- And many more via Groq's API

---

## 🎲 Adding Games & Tools

### Creating a New Tool

1. **Open** `utils/tool_registry.ts`
2. **Add your tool** to the `toolRegistry` object:

```typescript
your_game_name: {
  function: async (args: any) => {
    // Your game logic here
    client.sendMessage("233536287642@c.us", "Let's play!");
  },
  description: "Description of what your game does",
  parameters: {
    type: "object",
    properties: {
      hint: { type: "string", description: "Optional hint" },
    },
    required: [],
  },
}
```

3. The **AI automatically knows** about your tool and will call it when appropriate!

### Example Tools Already Implemented

- **`send_whatsapp_message`** - Send text responses
- **`picture_questions`** - Send random images from Cloudinary for guessing games

---

## 📚 Advanced Features

### Image Storage & Management

This bot integrates with **Cloudinary** for image handling:

- **Upload images** programmatically
- **Fetch random images** for games
- **Organize by tags** for categorization

**Example:**

```typescript
import { getRandomImage } from "./Helpers/cloudinary.js";

const imageUrl = await getRandomImage();
// Use imageUrl in your game
```

### Typing Indicators

Show "typing..." state to users for better UX:

```typescript
import { sendTypingWithDelay } from "./Helpers/whatsapp.js";

await sendTypingWithDelay(msg, 2000); // Show typing for 2 seconds
```

### Media Sending

Send images with captions:

```typescript
import { sendMedia } from "./Helpers/whatsapp.js";

await sendMedia("233536287642@c.us", imageUrl, {
  caption: "Check out this picture!",
});
```

---

## 🚧 Planned Features

### Coming Soon

- [ ] **Conversation History** - Remember user context across messages
- [ ] **Truth or Dare Game** - Full multiplayer game implementation
- [ ] **Leaderboard System** - Track user scores
- [ ] **Custom AI Models** - Support for Claude, GPT-4, Gemini Pro
- [ ] **Local LLM Support** - Run models locally with llama.cpp
- [ ] **Database Integration** - Persistent user data and game stats
- [ ] **Multi-User Support** - Handle multiple user conversations

### Conversation History Example

```typescript
const conversationHistory: { [key: string]: any[] } = {};

export const completion = async (msg: WAWebJS.Message) => {
  const userId = msg.from;

  // Initialize history for new users
  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [];
  }

  // Add user message
  conversationHistory[userId].push({
    role: "user",
    content: msg.body,
  });

  // Use full conversation history
  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a game bot..." },
      ...conversationHistory[userId],
    ],
    // ... rest of config
  });

  return response;
};
```

---

## 🎮 Supported Games

### Current Games

1. **Picture Questions** 🖼️

   - Bot sends random image from Cloudinary
   - User describes what they see
   - Great for GK and visual recognition!

2. **Text-based Games** 💬
   - Truth or Dare (in development)
   - Riddles, trivia, and more

---

## 📖 API Reference

### Tool Registry Structure

```typescript
{
  [toolName: string]: {
    function: (args: any) => Promise<void>
    description: string
    parameters: {
      type: "object"
      properties: { [key: string]: any }
      required: string[]
    }
  }
}
```

### Key Helper Functions

| Function                | Location                | Purpose                    |
| ----------------------- | ----------------------- | -------------------------- |
| `sendMessage()`         | `Helpers/whatsapp.ts`   | Send text message          |
| `sendMedia()`           | `Helpers/whatsapp.ts`   | Send image with caption    |
| `sendTypingWithDelay()` | `Helpers/whatsapp.ts`   | Show typing indicator      |
| `getRandomImage()`      | `Helpers/cloudinary.ts` | Fetch random image         |
| `uploadImage()`         | `Helpers/cloudinary.ts` | Upload image to Cloudinary |

---

## 🔐 Security Best Practices

⚠️ **Important:**

1. **Never commit `.env.local`** to git
2. **Regenerate API keys** if exposed
3. **Use `.gitignore`** to exclude sensitive files
4. **Keep credentials secure** - use environment variables only

---

## 🐛 Troubleshooting

### "Cannot find module 'dotenv'"

```bash
npm install dotenv
```

### "WhatsApp connection failed"

- Check your internet connection
- Rescan the QR code
- Clear `.wwebjs_auth/` and `.wwebjs_cache/` folders

### "Cloudinary image not loading"

- Verify `CLOUDINARY_PROJECT_NAME` is correct
- Upload test images via Cloudinary dashboard
- Check that images have proper file extensions

### AI not calling tools

- Check system prompt in `Helpers/qroq.ts`
- Verify tool descriptions are clear
- Ensure tool registry has required fields

---

## 💡 Tips & Tricks

### Using Different AI Models

Want to use Claude or GPT-4? Change the provider:

```typescript
// Instead of Groq, use OpenAI compatible endpoint
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.API_BASE_URL,
});
```

### Local LLM Setup

Run models locally with **llama.cpp**:

```bash
# Install ollama or llama.cpp
# Then update your AI client to use local endpoint
```

---

## 📝 Contributing

Have an awesome game idea or feature?

1. Fork the repo
2. Create a new branch
3. Add your changes
4. Submit a pull request

---

## 📄 License

ISC - See LICENSE file for details

---

## 🎉 Enjoy!

Have fun building cool tools and games! If you create something awesome, feel free to share it back with the community. Happy coding! 🚀

**Made with ❤️ for WhatsApp game lovers**
