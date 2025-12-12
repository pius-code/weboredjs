import { client } from "../core/client.js";
import {
  clearState,
  getParticipantNames,
  sendMedia,
} from "../Helpers/whatsapp.js";
import { sendTyping } from "../Helpers/whatsapp.js";
import WAWebJS from "whatsapp-web.js";
import { getRandomImage } from "../Helpers/cloudinary.js";
import { getRandomData } from "../Helpers/google_sheets.js";

export const toolRegistry: {
  [key: string]: {
    function: (args: any, msg?: WAWebJS.Message) => Promise<any>;
    description: string;
    parameters: any;
  };
} = {
  do_nothing: {
    function: async (args: any) => {
      return;
    },
    description:
      "Does nothing. Use this tool when a tool call is unneccessary because the response that was returned already satisfies user request",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  picture_questions: {
    function: async (args: any) => {
      const image = await getRandomImage();
      sendMedia("120363424142322037@g.us", image, {
        caption: "",
      });
      return "PIcture sent successfully";
    },
    description:
      "Sends a picture with a question text(in the picture) for the user to answer, The questions are interesting,fun can be edgy, basically something to keep the user not bored. ",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
    },
  },
  truth_or_dare: {
    function: async (args: any) => {
      const data = await getRandomData(args.text);
      client.sendMessage("120363424142322037@g.us", data);
      return "truth or dare fetched and sent successfully";
    },
    description:
      "sends a truth or dare question to the group based on the user's choice of 'truth' or 'dare'. The question is engaging and fun, designed to keep the game lively.the parameter to be passed is text which can either be 'truth' or 'dare' based on what the user chose.DONT MAKE MISTAKE ABOUT THE PARAMETER NAME IT HAS TO BE text AND ALWAYS BE SURE TO RECHECK THE PARAMETER NAME BEFORE USING THE TOOL.The user replying with Truth or truth or TRUTH should all be considered as truth same applies to dare.",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
    },
  },
  Get_Group_Members_Names: {
    function: async (args: any, msg) => {
      if (!msg) {
        throw new Error("This function requires group context (msg parameter)");
      }
      const names = await getParticipantNames(msg);
      return names;
    },
    description:
      "This tool returns the names of the members in a group, during truth or dare you can use this to alternate the questions or use this to track whose turn it is.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
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
