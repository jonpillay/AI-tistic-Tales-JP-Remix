const DCPromptDresser = async (promptDecription, artStyle, genre = null, character = null) => {

  console.log(artStyle)

  let stylePrompt = ''

  switch (artStyle) {
    case 'Comic Book':
      stylePrompt = 'A single, exciting, and exceptionally illustrated comic book frame depicting the scene of '
      break

    case 'Anime':
      stylePrompt = 'Meticulously drawn Anime style scene depicting '
      break

    case 'CGI':
      stylePrompt = 'Detailed computer generated image of '
      break

    case 'Frida Kahlo':
      stylePrompt = 'Surrealist fantasy style painting by the famous painter Frida Kahlo depicting the scene of '
      break

    case 'Dali':
      stylePrompt = 'Surrealist style painting by the famous painter Salvador Dali depicting the scene of '
      break

    case 'Pop Art':
      stylePrompt = 'Pop Art style image by Roy Lichtenstein or Andy Warhol depicting the scene of '
      break

    case 'Jean Michel Basquiat':
      stylePrompt = 'Artistic image in the style of Jean Michel Basquiat depicting the scene of '
      break

    case 'Yayoi Kusama':
      stylePrompt = 'Contemporary Pop Art Image in the style of Yayoi Kusama depicting the scene of '
      break

    case 'Ralph Steadman':
      stylePrompt = 'Stylistic drawing by the artist Ralph Steadman in pencil and watercolours depicting the scene of '
      break

    case 'Banksy':
      stylePrompt = 'Artistic image in the style of Banksy depicting the scene of '
  }

  const finalPrompt = stylePrompt.concat(promptDecription)

  return finalPrompt

}

module.exports = DCPromptDresser

// final art styles list = 'Comic Book', 'Animie', 'CGI', 'Dali', 'Frida Kahlo'