const express = require('express')
const router = express.Router()

const { getUser } = require('../controllers/user')
const { syncNotifications, deliverPush } = require('../controllers/push')
const { accessTokenValidator } = require('../middlewares/auth')

// accessToken validator middleware
router.post(
	'/profile',
	accessTokenValidator,
	getUser
)

router.post(
	'/notify',
	accessTokenValidator,
	syncNotifications
)

router.post(
	'/push',
	accessTokenValidator,
	deliverPush
)

module.exports = router