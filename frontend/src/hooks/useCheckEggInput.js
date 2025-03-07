import { useNavigate } from "react-router"
import { useState } from "react"

import { useLoadingContext } from "./useLoadingContext"

export const useCheckEggInput = () => {

  const {loadingDispatch} = useLoadingContext()

  /*

  Checks prompt input from InitialiseStoryForm for easter egg initialisation.

  1. Add prefix to your prompt input on 'start-your-story' page with 'guess= '.
  
  2. A guess of 'cup' would be 'guess= cup'.

  3. Answer the riddle 'What gets wet whilst drying?'

  4. Trigger the easter egg.

  5. Easter Egg initialisation only works from the prompt entry in 'start-your-story' prompt entry.

  */

  const [ guessResponse, setGuessResponse ]= useState()

  const navigate = useNavigate()

  const checkEggInput = async (inputPrompt) => {

    const splitPrompt = inputPrompt.split(" ")

    const splitPromptLowered = splitPrompt.map(word => word.toLowerCase())

    console.log(splitPromptLowered[0])

    if (splitPromptLowered[0] == 'guess=') {

      console.log("WE BE HERE THOUGH")

      const inputGuess = splitPromptLowered.slice(1).join(" ")

      console.log(inputGuess)

      try {

        const reqBody = {
          eggguess: inputGuess
        }
  
        const response = await fetch("/check-api/checkegg", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqBody),
        })
        
        const data = await response.json()
  
        if (data.decision == 1) {
          return true
        } else if (data.decision == 0) {
          return false
        } else {
          console.log(data.error)
          return data.error
        }
  
      } catch (error) {
        console.log(error)
        return error
      }

      // if (splitPromptLowered.includes(process.env.REACT_APP_WHAT_GETS_WET_WHILST_DRYING)) {
      //   loadingDispatch({type: 'LOADING'})
      //   navigate('/', {
      //     state: {error: "Egg Activated!", warnedState: "EASTEREGGACTIVATED"},
      //   })
      //   return true
      // } else {
      //   setGuessResponse("Incorrect Guess! Please Try Again.")
      //   return false
      // }
    }
  }

  return { checkEggInput, guessResponse, setGuessResponse }

}