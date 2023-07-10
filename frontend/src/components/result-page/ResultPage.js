import React, { useEffect, useState } from "react";
import Image from "../image/image";
import Story from "../story/Story";
import "./ResultPage.css";
import LoadingIcon from "../loading-icon/LoadingIcon";
import SteerStory from "../steer-story/SteerStory";
import HomeButton from "../home-button/HomeButton";

const ResultPage = ({ navigate }) => {

  const [imgUrl, setImgUrl] = useState();
  const [story, setStory] = useState();
  const [renderChapter, setRenderChapter] = useState(0)

  const [isLoaded, setIsLoaded] = useState(false);

  const storyPages = JSON.parse(localStorage.getItem("storyPages"))

  useEffect(() => {
    GPTClientCall();
  }, []);

  const GPTClientCall = () => {

    const userChoices = localStorage.getItem("userChoices")
    const GPTPromptHistory = localStorage.getItem("GPTPromptHistory")

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
        setStory(storyPages["textHistory"].slice(-1))
        setImgUrl(storyPages["imageHistory"].slice(-1))
        setIsLoaded(true)
        console.log(storyPages)
        let GPTPrompts = JSON.parse(GPTPromptHistory)
        GPTPrompts.push({
          role: "assistant",
          content: data["page_text"]
        })
        localStorage.setItem("GPTPromptHistory", JSON.stringify(GPTPrompts))
        console.log(GPTPrompts)

      });
  };

  const whatHappensNext = () => {
    // resetLoadingParameters();
    // updateStorageAndHooks(
    //   "prompt",
    //   "what you think will happen in the next chapter based on the history you received"
    // );
    // triggerReload();
  };

  const steerOnUserInput = (steerInput) => {
    setIsLoaded(false)

    let GPTPrompts = JSON.parse(localStorage.getItem("GPTPromptHistory"))

    console.log(steerInput)

    GPTPrompts.push({
      role: "user",
      content: steerInput
    })

    localStorage.setItem("GPTPromptHistory", JSON.stringify(GPTPrompts))

    setRenderChapter(renderChapter+1)

    GPTClientCall()

    // resetLoadingParameters();
    // updateStorageAndHooks("prompt", steerInput);
    // triggerReload();
  };

  const refreshStory = () => {
    // resetLoadingParameters();
    // const tempStorage = JSON.parse(localStorage.getItem("userChoices"));
    // tempStorage.messageHistory.pop();
    // tempStorage.imageHistory.pop();
    // localStorage.setItem("userChoices", JSON.stringify(tempStorage));
    // // setUserChoices(JSON.stringify(tempStorage));
    // triggerReload();
  };

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
      {isLoaded ? (
        <div className="result-page">
          <h1 className="resultpage-title">Here's your story!</h1>
          <div className="results-page-container">
            <div className="image-container">
              <Image link={imgUrl} />
            </div>
            <div className="result-story-container">
              <Story storyString={story} />
            </div>
        </div>
          <SteerStory callback={steerOnUserInput} />
            <div className="resultpage-buttons">
              <button className="resultpage-submit-button" data-cy="story-so-far" onClick={() => navigate("/storysofar")}>Story so far...</button> 
              <button className="resultpage-submit-button" data-cy="refresh" onClick={refreshStory}>Refresh the story</button>
              <button className="resultpage-submit-button" data-cy="next" onClick={whatHappensNext}>What happens next?</button>
            <div>
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
