const express = require('express')

const UserController = require('../controllers/userController')

const router = express.Router()

router.post('/login', UserController.LoginUser)

router.post('/signup', UserController.SignUpUser)

module.exports = router