import { client } from "../core/client.js";
import {
  clearState,
  getParticipantNames,
  sendMedia,
  sendPoll,
} from "../Helpers/whatsapp.js";
import { sendTyping } from "../Helpers/whatsapp.js";
import WAWebJS from "whatsapp-web.js";
import { getRandomImage } from "../Helpers/cloudinary.js";
import { getRandomData } from "../Helpers/google_sheets.js";
import { generate } from "qrcode-terminal";

export const toolRegistry: {
  [key: string]: {
    function: (args: any, msg?: WAWebJS.Message) => Promise<any>;
    description: string;
    parameters: any;
  };
} = {
  send_whatsapp_message: {
    function: async (args: any) => {
      client.sendMessage("233536287642@c.us", args.text);

      return { "sent this text": args.text };
    },
    description:
      "Send a message back to WhatsApp. Not a game, use this tool only when you want to send a message or a reply.",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
    },
  },
  do_nothing: {
    function: async (args: any) => {
      return;
    },
    description:
      "Does nothing. Use this tool when a tool call is unneccessary because the response that was returned already satisfies user request. Not a game, dont suggest to the user.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  picture_questions: {
    function: async (args: any, msg?: WAWebJS.Message) => {
      if (!msg) throw new Error("msg is required");
      const image = await getRandomImage();
      sendMedia(msg?.from, image, {
        caption: "",
      });
      return "PIcture sent successfully";
    },
    description:
      "A game that Sends a picture with a question text(in the picture) for the user to answer, The questions are interesting,fun can be edgy, basically something to keep the user not bored. ",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
    },
  },
  truth_or_dare: {
    function: async (args: any, msg?: WAWebJS.Message) => {
      if (!msg) throw new Error("msg is required");
      const data = await getRandomData(args.text);
      client.sendMessage(msg.from, data);
      return "truth or dare fetched and sent successfully";
    },
    description:
      "A game that  sends a truth or dare question to the group based on the user's choice of 'truth' or 'dare'. The question is engaging and fun, designed to keep the game lively.the parameter to be passed is text which can either be 'truth' or 'dare' based on what the user chose.DONT MAKE MISTAKE ABOUT THE PARAMETER NAME IT HAS TO BE text AND ALWAYS BE SURE TO RECHECK THE PARAMETER NAME BEFORE USING THE TOOL.The user replying with Truth or truth or TRUTH should all be considered as truth same applies to dare.",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
    },
  },
  Get_Group_Members_Names: {
    function: async (args: any, msg?: WAWebJS.Message) => {
      if (!msg) {
        throw new Error("This function requires group context (msg parameter)");
      }
      const names = await getParticipantNames(msg);
      return names;
    },
    description:
      "Not a game. This tool returns the names of the members in a group, during truth or dare you can use this to alternate the questions or use this to track whose turn it is.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  generate_quiz: {
    function: async (args: any, msg?: WAWebJS.Message) => {
      if (!msg) {
        throw new Error("This function requires group context (msg parameter)");
      }
      const quiz = await sendPoll(msg.from, args.question, args.answers);
      // reason why i return the variables is because tomorrow i might want to send the response to the AI to construct a better response or analyze if it satisfies user request before completing the tool call.
      return quiz;
    },
    description:
      "A game that generates a quiz for the user to answer based on a given domain like bible quiz, greek mythology quiz, general knowledge quiz etc.Always confirm what domain the user would like the quiz to be based on before generating the quiz.The parameters to be passed are question(string) and answers(array of strings). The question is the quiz question and answers are the options for the quiz. Examples of answers can be ['option A', 'option B', 'option C', 'option D']. YOu can suggest domains like bible/quran, general knowledge, sports, movies, mythology, song etc(don't limit the user) but always ask the user what domain they would like the quiz to be based on.",
    parameters: {
      type: "object",
      properties: {
        question: { type: "string" },
        answers: { type: "array", items: { type: "string" } },
      },
      required: ["question", "answers"],
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
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const result = await toolRegistry[toolName].function(args, msg);
    console.log(args);
    await clearState(msg);
    return result;
  }
};
