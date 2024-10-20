import { useAuthContext } from "../../hooks/useAuthContext"
import { useSaveStory } from "../../hooks/useSaveStory"

import { useSelector, useDispatch } from "react-redux"
import { selectAllChapterTexts, selectAllChapterImages } from "../story-book/storyBookSlice"
import { selectCharacter, selectGenre, selectArtStyle, selectGPTPromptHistory, selectStoryInSync, setStoryInSync, setMongoID, selectMongoID } from "../create-stories-page/storyBookSysInfoSlice"

import "./SaveStoryButton.css"

import SaveIcon from "../../img/floppy-disk-save.png"

function SaveStoryButton(props) {

  const { user } = useAuthContext()

  const { saveStory, updateStory, isLoading, error } = useSaveStory()

  const reduxDispatch = useDispatch()

  const storyInSync = useSelector(selectStoryInSync)

  const reduxChapterImages = useSelector(selectAllChapterImages)
  const reduxChapterText = useSelector(selectAllChapterTexts)

  const reduxCharacter = useSelector(selectCharacter)
  const reduxGenre = useSelector(selectGenre)
  const reduxArtStyle = useSelector(selectArtStyle)
  const reduxGPTPromptHistory = useSelector(selectGPTPromptHistory)
  const story_id = useSelector(selectMongoID)

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log(story_id)

    const stringStoryPages = localStorage.getItem('storyPages')

    // const genre = JSON.parse(localStorage.getItem('userChoices'))['genre']

    // const character = JSON.parse(localStorage.getItem('userChoices'))['character']

    // const artstyle = JSON.parse(localStorage.getItem('userChoices'))['style']

    // const GPTChatHistory = JSON.parse(localStorage.getItem('GPTPromptHistory'))

    const chapterImages = reduxChapterImages
    const chapterTexts = reduxChapterText

    const character = reduxCharacter
    const genre = reduxGenre
    const artStyle = reduxArtStyle
    const GPTPromptHistory = reduxGPTPromptHistory
    const storyID = story_id
    const AIEngineVer = "0.9"
    const author = user.username

    console.log("This is the stringStoryPages object that gets sent for save", chapterTexts)

    console.log(genre)

    const storyPages = JSON.parse(stringStoryPages)

    console.log("This is the storyPages object that gets sent for save", story_id)

    if (storyID != null) {
      try {
        // needs to be updated to read from redux
        console.log("This is chapter texts from the updateButton " + chapterTexts)
        await updateStory(storyID, chapterImages, chapterTexts, GPTPromptHistory)
        reduxDispatch(setStoryInSync(true))
        localStorage.setItem('storyInSync', 'true')
        setStoryInSync(true)
      } catch (error) {
        console.log(error)
      }
      
    } else {
      console.log("This is chapter texts from the saveButton " + chapterTexts)
      const story_id = await saveStory(chapterImages, chapterTexts, genre, character, artStyle, GPTPromptHistory, AIEngineVer, author)
      // console.log(story_id)
      localStorage.setItem('storyInSync', 'true')
      reduxDispatch(setStoryInSync(true))
      setStoryInSync(true)
    }
  }
  
  return (
    <>
    {!storyInSync ? (
      <div className="save-button-container">
        <button disabled={isLoading} className="save-story-button" onClick={handleSubmit}>
          <img className="save-icon" src={SaveIcon}/>
        </button>
        {error && <div className="error">{error}</div>}
      </div>
    ) : (
      <div className="save-button-container">

      </div>
    )}

    </>
  )
}

export default SaveStoryButton;