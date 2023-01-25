const express = require('express')
const router = express.Router()

const { entry, register, login } = require('../controllers/auth')

router.get('/', entry)
router.post('/register', register)
router.post('/login', login)

module.exports = router