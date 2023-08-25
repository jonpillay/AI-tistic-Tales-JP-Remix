import "./ActivationSignupPanel.css";
import ActivationForm from "../activation-form/ActivationForm";
import SignupForm from "../signup-form/SignupForm";
import HomeButton from "../home-button/HomeButton";
import { useActivate } from "../../hooks/useActivate";
import { useEffect, useState } from "react";

const ActivationSignupPanel = (props) => {
  console.log("Activation cat panel rerender")

  const { activate, isLoading, error, signupActive } = useActivate()

  console.log("This is from the panel", signupActive)

  return (
    <div>
    {(!signupActive ? 
      <ActivationForm activate={activate} isLoading={isLoading} error={error}/>
      :
      <SignupForm/>
    )}
    </div>

  )
}

export default ActivationSignupPanel;