const NodeCache = require('node-cache')

const sanitiseInput = require('../sanitiseFuncts/sanitiseInput')
const fetchBadWordsList = require('../sanitiseFuncts/badWordListFetch')

const cache = new NodeCache({ stdTTL: 3600 });

const CheckAPIController = {

  CheckFormInput: async (req, res) => {
    let badWordsList = await cache.get('badWordsList');

    if (!badWordsList) {
      console.log("BOOPYYY HERE!")
      try {
        badWordsList = await fetchBadWordsList()
        cache.set("badWordsList", badWordsList)
      } catch (error) {
        res.status(500).json({ error: error})
      }
    }
  
    const formInput = req.body.input
  
    const inputCheck = sanitiseInput(formInput, badWordsList)
  
    if (inputCheck == true) {
      res.status(200).json({ decision: 1 })
    } else if (inputCheck == false) {
      res.status(200).json( { decision: 0 })
    } else {
      res.status(500).json( { error: "Sanitise API Not Working" })
    }
  }
}

module.exports = CheckAPIController