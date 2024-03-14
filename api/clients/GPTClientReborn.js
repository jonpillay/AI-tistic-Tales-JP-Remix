import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GPT_KEY,
});

async function generateStory(prompts) {
  console.log("Backend GPT_KEY ", process.env.GPT_KEY)
  try {
    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: prompts,
    });
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("GPT client error, check your API key");
    const err = new Error(`GPT client error, check your API key`);
    err.status = 500;
    throw err;
  }
}

module.exports = generateStory;