const generateStory = require("../clients/GPTclient");
const GPTPromptGen = require("../promptGeneration/GPTPromptGen")

const DSDescriptionGen = require("../clients/DS_description_gen")

const generateImage = require("../clients/DSclient")
const DSPromptGen = require('../promptGeneration/DSPromptGen')

const DCPromptDresser = require('../promptGeneration/DCPromptDresser')

const creditController = require('./creditsController')


const jwt = require('jsonwebtoken')

const genCreditJWT = (token_id, token_amount) => {
  return jwt.sign({token_id, token_amount}, process.env.JWT_SIGNATURE, {expiresIn: '10m'})
}

const StoryController = {
  CreateChapter: async (req, res) => {
    try {

      const creditJWT = genCreditJWT(req.user._id, -3)
      const credits_update = await creditController.AdjustCredits(req.user._id, -3, creditJWT)

      const request = req.body

      const story_prompts = request["GPTPromptHistory"]
      const user_choices = request["userchoices"]

      const GPT_prompts = GPTPromptGen(user_choices, story_prompts) // Prompt gen here needs the prompt history in proper format as well as the user choices
      
      const story_text = await generateStory(GPT_prompts)

      const DS_descpription = await DSDescriptionGen(story_text, user_choices["genre"], user_choices["character"]) // needs 'system_prompts, chapter, genre, main_character' story text here needs to be only the content, not the full JSON object

      const dressed_prompt = await DCPromptDresser(DS_descpription, user_choices["style"])

      console.log("This is the dressed prompt ")
      console.log(dressed_prompt)

      const story_image = await generateImage(dressed_prompt)

      res.status(200).json({  page_text: story_text, page_image: story_image, credits_update: credits_update.credits });

    } catch (error) {
      console.log(error)
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = StoryController