import { useState } from "react";


export const useLoadIntoCreate = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)

  const loadIntoCreate = async (storyID) => {
    setIsLoading(true)
    setError(null)

    // Going to code this to fetch from the DB even if the StoryBook obj is already in local. This allows for the book to be fetched
    // even if all that is available to the frontend is the storyID. Futurproofing.

    const response = await fetch('./fetch-stories/genre', {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
    },
      body: JSON.stringify({storyID})
    })

    const JSONres = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(JSONres.error)
    }

    if (response.ok) {
      setIsLoading(false)
      return (JSONres.filteredList)
    }
  }

  return { loadIntoCreate }
}