const { google } = require('googleapis')

const dotenv = require('dotenv')

dotenv.config()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URL = 'http://localhost:3000/sync2google'

const oauth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URL
)

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
	'https://www.googleapis.com/auth/calendar'
]

module.exports = { scopes, oauth2Client }