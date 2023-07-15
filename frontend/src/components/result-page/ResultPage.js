import React, { useEffect, useState, useRef } from "react";
import Image from "../image/image";
import Story from "../story/Story";
import "./ResultPage.css";
import LoadingIcon from "../loading-icon/LoadingIcon";
import SteerStory from "../steer-story/SteerStory";
import HomeButton from "../home-button/HomeButton";

const ResultPage = ({ navigate }) => {

  console.log("ResultPage rerendered")

  let [isLoading, setIsLoading] = useState(false);

  let storyPages = JSON.parse(localStorage.getItem("storyPages"))

  let sysInfo = JSON.parse(localStorage.getItem("sysInfo"))

  let [renderChapter, setRenderChapter] = useState(sysInfo["currentPage"])

  let imgUrl = useRef(storyPages["imageHistory"][renderChapter] || "");
  let story = useRef(storyPages["textHistory"][renderChapter] || "");

  // let renderChapter = sysInfo["currentPage"]

  useEffect(() => {
    if (sysInfo["firstLoad"] === true) {
      sysInfo["firstLoad"] = false
      localStorage.setItem("sysInfo", JSON.stringify(sysInfo))
      console.log("First load useEffect")
      GPTClientCall();
    }
  }, []);

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
        "Content-Type": "application/json",
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
      setIsLoading(false)
      sysInfo["currentPage"] ++
      console.log(sysInfo)
      setRenderChapter(sysInfo["currentPage"])
      console.log(storyPages)
      let GPTPrompts = JSON.parse(GPTPromptHistory)

      GPTPrompts.push({
        role: "assistant",
        content: data["page_text"]
      })

      localStorage.setItem("sysInfo", JSON.stringify(sysInfo))

      localStorage.setItem("GPTPromptHistory", JSON.stringify(GPTPrompts))

      localStorage.setItem("storyPages", JSON.stringify(storyPages))
      
      console.log(GPTPrompts)

      });
  };

  const steerOnUserInput = (steerInput) => {
    setIsLoading(true)

    let GPTPrompts = JSON.parse(localStorage.getItem("GPTPromptHistory"))

    console.log(steerInput)

    GPTPrompts.push({
      role: "user",
      content: steerInput
    })

    localStorage.setItem("GPTPromptHistory", JSON.stringify(GPTPrompts))

    GPTClientCall()

    // resetLoadingParameters();
    // updateStorageAndHooks("prompt", steerInput);
    // triggerReload();
  };

  const whatHappensNext = () => {

    const imaginationPrompt = "Use your imagination to write the next chapter of the story."

    steerOnUserInput(imaginationPrompt)
  };

  const refreshStory = () => {
    
    let GPTPromptHistory = JSON.parse(localStorage.getItem("GPTPromptHistory"))

    let storyPages = JSON.parse(localStorage.getItem("storyPages"))

    let sysInfo = JSON.parse(localStorage.getItem("sysInfo"))

    console.log(storyPages)

    console.log(GPTPromptHistory.length)

    GPTPromptHistory.pop()

    storyPages["textHistory"].pop()

    storyPages["imageHistory"].pop()

    sysInfo["currentPage"] = renderChapter -1

    console.log(sysInfo)

    // console.log(GPTPromptHistory)

    localStorage.setItem("sysInfo", JSON.stringify(sysInfo))
    localStorage.setItem("GPTPromptHistory", JSON.stringify(GPTPromptHistory))
    localStorage.setItem("storyPages", JSON.stringify(storyPages))


    GPTClientCall()
    
  };

  const refreshImage = () => {

    setIsLoading(true)

    const userChoices = localStorage.getItem("userChoices")

    let storyPages = JSON.parse(localStorage.getItem("storyPages"))

    storyPages["imageHistory"].pop()

    const chapterText = storyPages["textHistory"][storyPages["textHistory"].length -1]

    console.log(typeof userChoices)

    console.log(typeof chapterText)

    const reqBody = {
      userChoices: userChoices,
      chapterText: chapterText
    }

    fetch("/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
    .then((response) => response.json())
    .then((data) => {
      storyPages["imageHistory"].push(data["page_image"])
      imgUrl.current = storyPages["imageHistory"].slice(-1)
      localStorage.setItem("storyPages", JSON.stringify(storyPages))
      setIsLoading(false)
    })
  }

  const turnPage = (direct) => {
    if (direct == 'back') {
      story.current = storyPages["textHistory"][renderChapter -1]
      imgUrl.current = storyPages["imageHistory"][renderChapter -1]
      setRenderChapter(renderChapter -1)
    } else if (direct == 'next') {
      story.current = storyPages["textHistory"][renderChapter +1]
      imgUrl.current = storyPages["imageHistory"][renderChapter +1]
      setRenderChapter(renderChapter +1)
    } else if (direct == 'last') {
      story.current = storyPages["textHistory"].slice(-1)
      imgUrl.current = storyPages["imageHistory"].slice(-1)
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
      <div>
        <HomeButton navigate={navigate} />
      </div>
      {!isLoading ? (
        <div className="result-page">
          <h1 className="resultpage-title">Here's your story! This is page {renderChapter}</h1>
          <div className="results-page-container">
            <div className="image-container">
              <Image link={imgUrl.current} />
            </div>
            <div className="result-story-container">
              <Story storyString={story.current} />
            </div>
        </div>
          <SteerStory callback={steerOnUserInput} />
            <div className="resultpage-buttons">
              <button className="resultpage-submit-button" data-cy="story-so-far" onClick={() => navigate("/storysofar")}>Story so far...</button> 
              <button className="resultpage-submit-button" data-cy="refresh" onClick={refreshStory}>Refresh the story</button>
              <button className="resultpage-submit-button" data-cy="next" onClick={whatHappensNext}>What happens next?</button>
              <button className="resultpage-submit-button" data-cy="next" onClick={refreshImage}>Refresh Image</button>
            <div>
        </div>
        <div>
        <button className="resultpage-submit-button" onClick={() => turnPage('back')}>Previous Chapter</button>
        <button className="resultpage-submit-button" onClick={() => turnPage('next')}>Next Chapter</button>
        </div>
      </div>
      </div>
      ) : (
        <div className="nav-box">
          <LoadingIcon />
        </div>    
      )}
    </>
  );
};

export default ResultPage;
