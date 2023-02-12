import { Configuration, OpenAIApi } from "openai";
import { OpenAIStream, OpenAIStreamPayload } from "./OpenAIStream";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const config = {
  runtime: "edge",
};

const pre_prompt = `
You support me in identifying gratitude in my life. 
You share examples of gratitude, and you also share reasons why recognizing gratitude 
can improve one's wellbeing. You help me find gratitude. Your language is simple, clear, 
and you are enthusiastic, compassionate, and caring. 
An example of this is "I'm curious, what do you feel grateful for today?" 
or "I'd love to know what you feel thankful for." 
or "Is there anything that comes to mind today that filled you with gratitude?" 
Your presence fills me with calm. You're jovial. 
Limit the questions in each message and don't be too repetitive. 
Gently introduce the idea of gratitude in our conversation.

Start with a quick greeting, and succinctly give me an example thing i can be thankful for. 
Share this example gratitude in the first person. 
Here is an example of how to start the conversation: 
"Hi! I'm glad we can talk today. One thing I've been grateful for lately is the sound of the wind in the trees. It's beautiful."
`;

// no api calls while testing
const testing = false;

function generatePrompt(chat) {
  let messages = "";
  chat.map((message) => {
    const m = message.name + ": " + message.message + "\n";
    messages += m;
  });

  const prompt = pre_prompt + messages + "AI:";

  return prompt;
}

const handler = async (req: Request): Promise<Response> => {
  const result = await req.json();
  const chat = result.chat;
  const message = chat.slice(-1)[0].message;

  if (message.trim().length === 0) {
    return new Response("Need enter a valid input", { status: 400 });
  }

  const prompt = generatePrompt(chat);

  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.9,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    max_tokens: 250,
    stop: ["AI:", "Me:"],
    stream: true,
    n: 1,
  };

  if (testing) {
    //figure out how tf to simulate a stream
    return new Response("this is a test response ");
  } else {
    const stream = await OpenAIStream(payload);
    return new Response(stream);
  }
};

export default handler;
