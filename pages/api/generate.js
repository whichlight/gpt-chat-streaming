import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  //check the most recent message
  const chat = req.body.chat || "";
  const message = chat.slice(-1)[0].message;

  if (message.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      },
    });
    return;
  }

  try {
    if (testing) {
      setTimeout(() => {
        res.status(200).json({
          result: "Yay, currently testing",
        });
      }, 1000);
    } else {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(chat),
        temperature: 0.9,
        max_tokens: 250,
        presence_penalty: 0.6,
        stop: ["AI:", "Me:"],
      });
      res.status(200).json({ result: completion.data.choices[0].text });
    }
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(chat) {
  let messages = "";
  chat.map((message) => {
    const m = message.name + ": " + message.message + "\n";
    messages += m;
  });

  const prompt = pre_prompt + messages + "AI:";

  return prompt;
}
