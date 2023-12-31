const StoryBook = require('../database/models/storyBookModel')

const StoryPersistenceController = {
  SaveStory: async (req, res) => {

    const {storyPages, genre, character, artstyle} = req.body

    const user_id = req.user._id

    try {

      const story = await StoryBook.saveStory(user_id, storyPages, genre, character, artstyle)

      res.status(200).json({ error: "Story saved", story_id: story._id  })
    } catch (error) {

      res.status(400).json({error: error.message })
    }
  },

  UpdateStory: async (req, res) => {

    const {story_id, storyPages} = req.body

    const storyBook = await StoryBook.findById(story_id)

    const user_id = req.user._id

    console.log("this is the user_id attatched to storyBook obj ", storyBook.user_id)
    console.log("this is the user_id attatched to request ", user_id)


    if (storyBook.user_id != user_id) {
      res.status(400).json({error: "Must be story creator to update" })
    }

    try {

      const story = await StoryBook.updateStory(storyBook._id, storyPages)

      res.status(200).json({ error: "Story saved"})
    } catch (error) {

      res.status(400).json({error: error.message })
    }
  },

}

module.exports = StoryPersistenceController
