const { google } = require('googleapis')
const { scopes, oauth2Client } = require('../config/google')

const { Op } = require('sequelize')
const creatError = require('http-errors')
const db = require('../models')
const webpush = require('web-push')
const { signJwtToken } = require('../utils/jwt')

// Access token delivery handler
const tokenHandler = async (user) => {
	try {
		// generate token
		const accessToken = await signJwtToken(user, {
			secret: process.env.JWT_ACCESS_TOKEN_SECRET,
			expiresIn: process.env.JWT_EXPIRY
		})
		return Promise.resolve(accessToken)
	} catch (error) {
		return Promise.reject(error)
	}
}

// handles register
exports.register = async (req, res, next) => {
	try {
		// VAPID keys should be generated only once.
		const vapidKeys = webpush.generateVAPIDKeys()
		const data = req.body
		// insert data to `users` table
		const user = await db.User.create({
			fname: data.fname,
			lname: data.lname,
			mobile: data.mobile,
			email: data.email,
			publicID: vapidKeys.publicKey,
			privateID: vapidKeys.privateKey,
			dob: data.dob
		})

		console.log(`✅: ${user}`)

		res.status(201)
		res.send('Account created successfully')
	} catch (error) {
		next(error)
	}
}

// handles login
exports.login = async (req, res) => {
	try {
		const data = req.body
		let token
		// TODO: verify and authenticate
		console.log({ data })

		// TODO: authorize and grant jwt token
		// !FIXME: Change login to use only username and password
		let output
		await db.User.findOne({
			where: {
				[Op.and]: [
					{ email: data.email },
					{ lname: data.lname }
				]
			}
		}).then(async userData => {
			console.log(`✅: ${userData}`)

			if (!userData) return creatError(404, 'User does not exist...')

			const { fname, lname, email, dob, privateID, publicID, mobile, id } = userData

			if (!id) return creatError(404, 'User does not exist in Server...')

			token = await tokenHandler({ id, lname, email, publicID })

			const object = { fname, lname, email, dob, privateID, publicID, mobile, id, token }
			console.log({ object })
			output = { user: object, token, email }

			return output
		}).then(output => res.json(output))
	} catch (err) {
		console.error(`❌: ${err}`)
		return creatError(404, 'Login Failed!')
	}
}

exports.entry = async (req, res) => {
	res.render('index')
}


exports.googleOAuth = async (req, res) => {
	try {

		const url = oauth2Client.generateAuthUrl({
			// 'online' (default) or 'offline' (gets refresh_token)
			access_type: 'offline',
			// If you only need one scope you can pass it as a string
			scope: scopes
		})
		res.redirect(url)
	} catch (err) {
		console.log(err)
		return creatError(404, 'Google OAuth Failed!')
	}
}

exports.googleSync = async (req, res) => {
	try {
		const code = req.query.code
		const { tokens } = await oauth2Client.getToken(code)
		console.log({ tokens })
		oauth2Client.setCredentials(tokens)
		const calendar = google.calendar({
			version: 'v3',
			auth: oauth2Client
		})

		let eventStartTime = new Date()
		console.log({ a: eventStartTime.getDate() })

		eventStartTime.setDate(eventStartTime.getDate() + 5)

		let eventEndTime = new Date()
		eventEndTime.setDate(eventEndTime.getDate() + 5)
		eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

		const event = {
			summary: 'Movie Night!!!',
			location: 'Thiruvananthapuram, Kerala',
			description: 'Grab a Popcorn, it\'s Movie Night!',
			start: {
				dateTime: eventStartTime,
				timeZone: 'Asia/Kolkata',
			},
			end: {
				dateTime: eventEndTime,
				timeZone: 'Asia/Kolkata'
			},
			colorId: 1,
		}

		console.log({ event })

		calendar.freebusy.query({
			resource: {
				timeMin: eventStartTime,
				timeMax: eventEndTime,
				timeZone: 'Asia/Kolkata',
				items: [{ id: 'primary' }],
			},
		}, (err, res) => {
			if (err) return console.error('Free Busy Query Error: ', err)
			
			const eventsArr = res.data.calendars.primary.busy

			if (eventsArr.length === 0) return calendar.events.insert({
				calendarId: 'primary',
				resource: event
			}, err => {
				if (err) return console.error('Calendar Event Creation Error: ', err)

				return console.log('Calendar Event Created.')
			})
			return console.log('Sorry I\'m Busy')
		})
		res.send(`Google Calendar Event Created \n${event.summary} on ${event.start.dateTime.getDate()}`)
		res.render('page')
	} catch (err) {
		console.log(err)
		return creatError(404, 'Google Syncronization Failed!')
	}
}