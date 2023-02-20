const express = require('express')
const router = express.Router()

const { getUser } = require('../controllers/user')
const { syncNotifications, deliverPush } = require('../controllers/push')
const { accessTokenValidator } = require('../middlewares/auth')
const { googleOAuth, googleSync } = require('../controllers/auth')

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

router.get(
	'/sync2google',
	googleSync
)
	
router.get(
	'/google-oauth',
	googleOAuth	
)

module.exports = router