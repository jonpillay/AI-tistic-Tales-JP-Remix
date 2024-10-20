const StoryBook = require('../database/models/storyBookModel')

const FetchStoriesController = {

  GetStoriesByGenre: async (req, res) => {

    console.log(req.body)

    const requestGenre = req.body;

    try {

      console.log("This is from line 13 fetchController", {requestGenre})

      const bookList = await StoryBook.find(requestGenre).exec()

      res.status(200).json({ filteredList: bookList })
    } catch (error) {
      
      res.status(400).json({error: error.message })
    }
  },

  GetStoriesByUser: async (req, res) => {

    console.log(req.body)

    const requestUser = req.body;

    try {

      const bookList = await StoryBook.find(requestUser).exec()

      res.status(200).json({ filteredList: bookList })
    } catch (error) {
      res.status(400).json({error: error.message })
    }
  },

  FetchStoryByID: async (req, res) => {

    console.log(req.body)

    const requestStoryID = req.body.storyID

    const user_id = req.user._id

    console.log(requestStoryID)
    console.log(user_id)

    try {
      const storyBook = await StoryBook.findById(requestStoryID)
      console.log("This is the storybook object " + storyBook)
      console.log(storyBook.user_id)
      const author = storyBook.user_id
      console.log("This is the author " + author)
      console.log(author)
      if (author != user_id) {
        res.status(401).json({error: "Must be story owner."})
      } else {
        res.status(200).json({ resStoryBook: storyBook })
      }
    } catch (error) {
      res.status(400).json({error: error.message })
    }

  }  

}

module.exports = FetchStoriesController