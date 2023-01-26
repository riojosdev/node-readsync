const express = require('express')
const router = express.Router()

const { getUser } = require('../controllers/user')
const { syncPush } = require('../controllers/push')
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
    syncPush
)

module.exports = router