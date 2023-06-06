import React, { useEffect, useState } from "react";
import Image from "../image/image";
import Story from "../story/Story";
import "./ResultPage.css";
import LoadingIcon from "../loading-icon/LoadingIcon";
import SteerStory from "../steer-story/SteerStory"
import HomeIcon from "./home-icon.png"
import HomeButton from "../home-button/HomeButton";

const ResultPage = ({ navigate }) => {
  const [userChoices, setUserChoices] = useState(
    window.localStorage.getItem("userChoices")
  );
  const [imgUrl, setImgUrl] = useState();
  const [story, setStory] = useState();
  const [SDLoaded, setSDLoaded] = useState(false);
  const [GPTLoaded, setGPTLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    GPTClientCall(userChoices);
    sdClientCall(userChoices);
  }, [reload]);

  const triggerReload = () => {
    setReload((prevStat) => !prevStat);
  };

  useEffect(() => {
    if (SDLoaded === true && GPTLoaded === true) {
      setIsLoaded(true);
    }
  }, [SDLoaded, GPTLoaded]);

  const sdClientCall = (userChoices) => {
    fetch("/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: userChoices,
    })
      .then((response) => response.json())
      .then((data) => {
        setImgUrl(data.imgUrl);
        setSDLoaded(true);
      });
  };

  const GPTClientCall = (userChoices) => {
    fetch("/story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: userChoices,
    })
      .then((response) => response.json())
      .then((data) => {
        setStory(data["storyText"]);
        updateStorageAndHooks("messageHistory", data["storyText"]);
        setGPTLoaded(true);
      });
  };

  const whatHappensNext = () => {
    resetLoadingParameters();
    updateStorageAndHooks(
      "prompt",
      "what you think will happen in the next chapter based on the history you received"
    );
    triggerReload();
  };

  const resetLoadingParameters = () => {
    setGPTLoaded(false);
    setSDLoaded(false);
    setIsLoaded(false);
  };

  const updateStorageAndHooks = (key, value) => {
    const tempStorage = JSON.parse(localStorage.getItem("userChoices"));
    if (key === "messageHistory") {
      tempStorage.messageHistory.push(value);
    } else {
      tempStorage[key] = value;
    }
    localStorage.setItem("userChoices", JSON.stringify(tempStorage));
    setUserChoices(tempStorage);
  };

  const handleButtonClick = () => {
    setIsButtonPressed(true);
  };

  const handleButtonCancelClick = () => {
    setIsButtonPressed(false);
  };


  return (
    <>
      <div>
        <HomeButton navigate={ navigate }/>
      </div>
      {isLoaded ? (
        <div className="result-page">
          <div className="results-page-container">
            <Image link={imgUrl} />
            <Story storyString={story} />
            <div className="buttons">
              <button
                className="submit-button"
                data-cy="next"
                onClick={whatHappensNext}
              >
                What happens next?
              </button>
              <button className="submit-button">Save this story</button>
              <button className="submit-button">Refresh the story</button>
            </div>
            <div>
              <SteerStory
                isButtonPressed={isButtonPressed}
                handleButtonClick={handleButtonClick}
                handleButtonCancelClick={handleButtonCancelClick}
              />
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
