import React, { useEffect, useState, useRef } from "react";
import Image from "../image/image";
import Story from "../story/Story";
import TurnPageButton from "../turn-page-button/turnPageButton";
import "./ResultPage.css";
import LoadingIcon from "../loading-icon/LoadingIcon";
import SteerStory from "../steer-story/SteerStory";
import ChapterTitle from "../chapter-title/ChapterTitle";
import HomeButton from "../home-button/HomeButton";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router";

const ResultPage = () => {

  const navigate = useNavigate()

  const { user } = useAuthContext()

  console.log("ResultPage rerendered")

  let [isLoading, setIsLoading] = useState(false);

  let storyPages = JSON.parse(localStorage.getItem("storyPages"))

  let sysInfo = JSON.parse(localStorage.getItem("sysInfo"))

  let [renderChapter, setRenderChapter] = useState(sysInfo["currentPage"])

  let imgUrl = useRef(storyPages["imageHistory"][renderChapter] || "");
  let story = useRef(storyPages["textHistory"][renderChapter] || "");

  // let renderChapter = sysInfo["currentPage"]

  useEffect(() => {
    if (user) {
      if (sysInfo["firstLoad"] === true) {
        sysInfo["firstLoad"] = false
        localStorage.setItem("sysInfo", JSON.stringify(sysInfo))
        console.log("First load useEffect")
        GPTClientCall();
      }
    } else {
      navigate('/')
    }

  }, [user]);

  const GPTClientCall = () => {

    setIsLoading(true)

    console.log(`This is story pages from the GPTcall funct`)

    const userChoices = localStorage.getItem("userChoices")
    let GPTPromptHistory = localStorage.getItem("GPTPromptHistory")
    let storyPages = JSON.parse(localStorage.getItem("storyPages"))
    let sysInfo = JSON.parse(localStorage.getItem("sysInfo"))


    console.log(storyPages)

    const reqBody = {
      userchoices: userChoices,
      GPTPromptHistory: GPTPromptHistory
    }

    fetch("/story", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(reqBody),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      console.log(data["page_text"])
      storyPages["textHistory"].push(data["page_text"])
      storyPages["imageHistory"].push(data["page_image"])
      story.current = storyPages["textHistory"].slice(-1)
      imgUrl.current = storyPages["imageHistory"].slice(-1)
      sysInfo["currentPage"] ++
      setIsLoading(false)
      console.log(sysInfo)
      console.log(storyPages)
      let GPTPrompts = JSON.parse(GPTPromptHistory)

      GPTPrompts.push({
        role: "assistant",
        content: data["page_text"]
      })

      localStorage.setItem("sysInfo", JSON.stringify(sysInfo))

      localStorage.setItem("GPTPromptHistory", JSON.stringify(GPTPrompts))

      localStorage.setItem("storyPages", JSON.stringify(storyPages))

      setRenderChapter(sysInfo["currentPage"])
      
      console.log(GPTPrompts)

      });
  };

  const steerOnUserInput = (steerInput) => {
    if (user) {
      setIsLoading(true)

      let GPTPrompts = JSON.parse(localStorage.getItem("GPTPromptHistory"))
  
      console.log(steerInput)
  
      GPTPrompts.push({
        role: "user",
        content: steerInput
      })
  
      localStorage.setItem("GPTPromptHistory", JSON.stringify(GPTPrompts))
  
      GPTClientCall()
    } else {
      navigate('/')
    }

  };

  const whatHappensNext = () => {

    if (user) {
      const imaginationPrompt = "Use your imagination to write the next chapter of the story."

      steerOnUserInput(imaginationPrompt)
    } else {
      navigate('/')
    }

  };

  const refreshStory = () => {

    if (user) {
      let GPTPromptHistory = JSON.parse(localStorage.getItem("GPTPromptHistory"))

      let storyPages = JSON.parse(localStorage.getItem("storyPages"))
  
      let sysInfo = JSON.parse(localStorage.getItem("sysInfo"))
  
      console.log(storyPages)
  
      console.log(GPTPromptHistory.length)
  
      GPTPromptHistory.pop()
  
      storyPages["textHistory"].pop()
  
      storyPages["imageHistory"].pop()
  
      sysInfo["currentPage"] = renderChapter -1
  
      localStorage.setItem("sysInfo", JSON.stringify(sysInfo))
      localStorage.setItem("GPTPromptHistory", JSON.stringify(GPTPromptHistory))
      localStorage.setItem("storyPages", JSON.stringify(storyPages))
  
  
      GPTClientCall()
    } else {
      navigate('/')
    }
    

    
  };

  const refreshImage = () => {

    if (user) {

      setIsLoading(true)

      const userChoices = localStorage.getItem("userChoices")
  
      let storyPages = JSON.parse(localStorage.getItem("storyPages"))
  
      storyPages["imageHistory"].splice(renderChapter, 1)
  
      const chapterText = storyPages["textHistory"][renderChapter]
  
      console.log(typeof userChoices)
  
      console.log(typeof chapterText)
  
      const reqBody = {
        userChoices: userChoices,
        chapterText: chapterText
      }
  
      fetch("/images", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(reqBody),
      })
      .then((response) => response.json())
      .then((data) => {
        storyPages["imageHistory"].splice(renderChapter, 0, data["page_image"])
        imgUrl.current = storyPages["imageHistory"][renderChapter]
        localStorage.setItem("storyPages", JSON.stringify(storyPages))
        setIsLoading(false)
      })
    } else {
      navigate('/')
    }

  }

  const turnPage = (direct) => {
    if (direct == 'back') {
      story.current = storyPages["textHistory"][renderChapter -1]
      imgUrl.current = storyPages["imageHistory"][renderChapter -1]
      sysInfo["currentPage"] --
      localStorage.setItem("sysInfo", JSON.stringify(sysInfo))
      setRenderChapter(renderChapter -1)
    } else if (direct == 'next') {
      sysInfo["currentPage"] ++
      localStorage.setItem("sysInfo", JSON.stringify(sysInfo))
      story.current = storyPages["textHistory"][renderChapter +1]
      imgUrl.current = storyPages["imageHistory"][renderChapter +1]
      setRenderChapter(renderChapter +1)
    } else if (direct == 'last') {
      story.current = storyPages["textHistory"].slice(-1)
      imgUrl.current = storyPages["imageHistory"].slice(-1)
      sysInfo["currentPage"] = storyPages["textHistory"].length -1
      localStorage.setItem("sysInfo", JSON.stringify(sysInfo))
      setRenderChapter = storyPages["textHistory"][storyPages["textHistory"].length -1]
    }
  }

  const updateStorageAndHooks = (key, value) => {
    // const tempStorage = JSON.parse(localStorage.getItem("userChoices"));
    // console.log(tempStorage)
    // if (key === "messageHistory" || key === "imageHistory") {
    //   tempStorage[key] = [...tempStorage[key], value];
    // } else {
    //   tempStorage[key] = value;
    // }
    // localStorage.setItem("userChoices", JSON.stringify(tempStorage));
    // // setUserChoices(JSON.stringify(tempStorage));
  };

  return (
    <>
      {!isLoading ? (
        <>
        <HomeButton/>
        <div className="page-container">
          <ChapterTitle chapterNumber={renderChapter + 1}/>
          <div className="results-container">
            <div className="next-page-container">
              {renderChapter>0 &&
                <TurnPageButton id="previous-page-button" direct="back" label="Previous Chapter" callback={turnPage}/>
              }
            </div>
            <div className="storybook-container">
                <Image link={imgUrl.current} />
                <Story storyString={story.current} />
            </div>
            <div className="next-page-container">
              {renderChapter!=storyPages["textHistory"].length-1 &&
                <TurnPageButton id="next-page-button" direct="next" label="Next Chapter" callback={turnPage}/>
              }
            </div>
          </div>
          <div className="nav-container">
          <SteerStory callback={steerOnUserInput} />
          <div className="resultpage-button-container">
            <div>
              <button className="resultpage-button" data-cy="refresh" onClick={refreshStory}>Refresh the story</button>
            </div>
            <div>
              <button className="resultpage-button" data-cy="next" onClick={whatHappensNext}>What happens next?</button>
            </div>
            <div>
              <button className="resultpage-button" data-cy="next" onClick={refreshImage}>Refresh Image</button>
            </div>
          </div>
          </div>
        </div>
        </>
      ) : (
        <div className="nav-box">
          <LoadingIcon />
        </div>    
      )}
    </>
  )};
  

export default ResultPage;
