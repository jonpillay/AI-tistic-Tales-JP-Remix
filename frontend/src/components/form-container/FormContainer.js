import React, { useState, useEffect } from "react";
import Form from "../forms/Form";
import TextInput from "../text-input-form/TextInput";
import "./form-container.css";
import logo from "./homepageLogo.gif";

const FormContainer = ({ navigate }) => {
  const character = ['Spiderman', 'Rapunzel', 'Darth Vader', 'Wonder Woman', 'Batman', 'Hermione Granger'];
  const genre = ['Dystopian', 'Fairytale', 'Western', 'Cyberpunk', 'Sci-Fi'];
  const style = ['Cartoon', 'Realistic', 'Pixar', 'Anime', 'Painting'];

  const [isAnimationVisible, setIsAnimationVisible] = useState(true);
  
  const [formValues, setFormValues] = useState({
    character: "",
    genre: "",
    style: "",
    prompt: "",
    messageHistory: [],
    imageHistory: [],
  });

  useEffect(() => {
    const animationDuration = 1;
    const animationTimeout = setTimeout(() => {
      setIsAnimationVisible(false);
    }, animationDuration);

    return () => {
      clearTimeout(animationTimeout);
    };
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem("userChoices");
    localStorage.setItem("userChoices", JSON.stringify(formValues));
    navigate("/results");
  };

  const handleDropdownChange = (fieldName, selectedValue) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [fieldName]: selectedValue,
    }));
  };

  const handleInputChange = (inputText) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      prompt: inputText,
    }));
  };

  useEffect(() => {}, [formValues]);

  return (
      <div className="formcontainer">
        {isAnimationVisible && (
          <img className="formcontainer-logo-gif" src={logo} alt="test" />
        )}
        {!isAnimationVisible && (
      <div className="formcontainer-container">
        <h1 className="formcontainer-title">
          Get started with some details...
        </h1>
        <form onSubmit={handleFormSubmit}>
          
          <Form
            dropdownItems={character}
            selectionField="Character"
            selectedValue={formValues.character}
            onDropdownChange={(selectedValue) =>
              handleDropdownChange("character", selectedValue)
            }
          />
          <Form
            dropdownItems={genre}
            selectionField="Writing Style"
            selectedValue={formValues.genre}
            onDropdownChange={(selectedValue) =>
              handleDropdownChange("genre", selectedValue)
            }
          />
          <Form
            dropdownItems={style}
            selectionField="Artistic Style"
            selectedValue={formValues.style}
            onDropdownChange={(selectedValue) =>
              handleDropdownChange("style", selectedValue)
            }
          />
          <TextInput
            handleInputChange={handleInputChange}
            textField={"Prompt"}
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
      )}
    </div>
  );
};

export default FormContainer;