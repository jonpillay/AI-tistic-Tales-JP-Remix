const StoryBook = require('../database/models/storyBookModel')

const StoryPersistenceController = {
  SaveStory: async (req, res) => {

    const {chapterImages, chapterTexts, genre, character, artstyle, GPTChatHistory, AIEngineVer, author} = req.body

    const user_id = req.user._id

    console.log("How save story sees the req objects")
    console.log(user_id)
    console.log(chapterImages)
    console.log(chapterTexts)

    try {

      const story = await StoryBook.saveStory(user_id, chapterImages, chapterTexts, genre, character, artstyle, GPTChatHistory, AIEngineVer, author)
      console.log("we do get here")
      res.status(200).json({ message: "Story saved", story_id: story._id  })
    } catch (error) {
      console.log("We failing here")
      res.status(400).json({error: error.message })
    }
  },

  UpdateStory: async (req, res) => {

    const {story_id, chapterImages, chapterTexts, GPTChatHistory} = req.body

    console.log("How update story sees the req objects")
    console.log(chapterImages)
    console.log(chapterTexts)
    console.log(GPTChatHistory)

    const storyBook = await StoryBook.findById(story_id)

    const user_id = req.user._id

    // console.log("this is the user_id attatched to storyBook obj ", storyBook.user_id)
    // console.log("this is the user_id attatched to request ", user_id)


    if (storyBook.user_id != user_id) {
      res.status(400).json({error: "Must be story creator to update" })
    }

    try {

      const story = await StoryBook.updateStory(storyBook._id, chapterImages, chapterTexts, GPTChatHistory)

      res.status(200).json({ error: "Story saved"})
    } catch (error) {

      res.status(400).json({error: error.message })
    }
  },

  SubmitRating: async (req, res) => {

    const { story_id, rating } = req.body

    const user_id = req.user._id

    const storyBook = await StoryBook.findById(story_id)

    if (storyBook.user_id == user_id) {
      res.status(400).json({error: "Cannot Rate Own Story" })
    }

    // if (storyBook.ratings.find(rating => rating.user_id === newRating.user_id)) {
    //   res.status(400).json({error: "Rating already submitted"})
    // }

    try {

      await StoryBook.submitRating(storyBook._id, user_id, rating)

      res.status(200).json({ message: "Rated"})
    } catch (error) {

      res.status(400).json({error: error.message })
    }

  }

}

module.exports = StoryPersistenceController
