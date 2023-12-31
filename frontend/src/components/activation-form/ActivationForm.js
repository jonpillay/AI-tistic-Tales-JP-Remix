import { useState, useRef } from "react";
import { useLogin } from "../../hooks/useLogIn";
import './ActivationForm.css'
import { useActivate } from "../../hooks/useActivate";
// const jwt = require("jsonwebtoken");

const ActivationForm = ({activate, isLoading, error}) => {
  console.log("Activate Form Rerender")
  const activationEmail = useRef()
  const activationInviteCode = useRef()
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(activationEmail.current.value)
    console.log(activationInviteCode.current.value)

    await activate(activationEmail.current.value, activationInviteCode.current.value)

  }

  return (
    <div className="form-container">
      <form className="activation-form" onSubmit={handleSubmit}>
        <div className="activation-title-container">
          <div className="activation-title">Activate Your Account!</div>
        </div>
        <div className="input-container">
          <div>
            <input type="email" className="activation-input-box" ref={activationEmail} placeholder="email..."/> 
          </div>
          <div>
            <input type="text" className="activation-input-box" ref={activationInviteCode} placeholder="invite code..."/> 
          </div>
        </div>
        <div className="activation-submit-container">
          <button disabled={isLoading} className="submit-button" id="activation-submit-button" type="submit">ACTIVATE</button>
          {error && <div className="error">{error}</div>}
        </div>
      </form>
    </div>
  )
}

export default ActivationForm;