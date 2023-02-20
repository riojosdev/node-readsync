const { google } = require('googleapis')
const { scopes, oauth2Client } = require('../config/google')

const { Op } = require('sequelize')
// const { v4: uuid } = require('uuid')
const creatError = require('http-errors')
// const client = require('../utils/db')
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
		// const query = `// INSERT INTO users (fname, lname, mobile, email, publicID, privateID, dob) // VALUES ('${data.fname}', '${data.lname}', '${data.mobile}', '${data.email}', '${vapidKeys.publicKey}', '${vapidKeys.privateKey}', '${data.dob}')`


		const user = await db.User.create({
			fname: data.fname,
			lname: data.lname,
			mobile: data.mobile,
			email: data.email,
			publicID: vapidKeys.publicKey,
			privateID: vapidKeys.privateKey,
			dob: data.dob
		})

		// client
		// 	.query(query)
		// 	.then(res => {
		console.log(`✅: ${user}`)
		// .finally(() => {
		//     client.end();
		// })

		res.status(201)
		res.send('Account created successfully')
	} catch (error) {
		next(error)
	}
}

// handles login
// exports.login = async (req, res, next) => {
exports.login = async (req, res) => {
	try {
		const data = req.body
		// const email = data.email
		let token
		// todo: verify and authenticate
		// const query = `// SELECT * FROM users WHERE email='${data.email}' AND lname='${data.lname}';`
		console.log({ data })

		// todo: authorize and grant jwt token
		let output
		db.User.findOne({
			where: {
				[Op.and]: [
					{ email: data.email },
					{ lname: data.lname }
				]
			}
		}).then(async userData => {
			console.log(`✅: ${userData}`)

			// if (!userData) throw creatError.NotFound()
			if (!userData) return creatError(404, 'User does not exist...')
			// if (!userData) return res.status(404).send({ error: 'User does not exist...'})

			const { fname, lname, email, dob, privateID, publicID, mobile, id } = userData

			// if (!(id)) throw creatError.Unauthorized()
			if (!(id)) return creatError(404, 'User does not exist in Server...')
			// if (!(id)) return res.status(404).send({ error: 'User does not exist in ReadSync Server...'})

			token = await tokenHandler({ id, lname, email, publicID })

			const object = { fname, lname, email, dob, privateID, publicID, mobile, id, token }
			console.log({ object })
			output = { user: object, token, email }

			return output
		}).then(output => res.json(output))
		// await client.query(query)
		// .then(async res => {
		// const userData = res.rows[0]
		// user = userData
		// const { id, lname, email, publicid } = res.rows[0]
		// console.log({id, lname, email, publicid})



		// res.send(token);\
		// res.json(output)
	} catch (err) {
		console.error(`❌: ${err}`)
		// throw creatError.NotFound()
		return creatError(404, 'Login Failed!')
		// return res.status(404).send({ error: 'Login Failed'})
	}

	// if (!userData) throw creatError.NotFound()

	// const { id, username, password: dbPassword } = JSON.parse(userData)

	// if (!(id && (password === dbPassword))) throw creatError.Unauthorized()

	// const token = await tokenHandler({ id, username, email })
	// Add the token to the header
	// const headers = {
	//     'Authorization': 'Bearer ' + token
	// };
	// console.log({user: user, token, email})
	// res.render('users', { user, email })
	// res.json(output)
	// } catch (error) {
	// 	next(error)
	// }
}

// exports.entry = async (req, res, next) => {
exports.entry = async (req, res) => {
	res.render('index')
}


exports.googleOAuth = async (req, res) => {
	const url = oauth2Client.generateAuthUrl({
		// 'online' (default) or 'offline' (gets refresh_token)
		access_type: 'offline',

		// If you only need one scope you can pass it as a string
		scope: scopes
	})
	res.redirect(url)
}

exports.googleSync = async (req, res) => {
	// console.log({a: req.params, b: req.query});
	const code = req.query.code
	const { tokens } = await oauth2Client.getToken(code)
	console.log({ tokens })
	oauth2Client.setCredentials(tokens)
	const calendar = google.calendar({
		version: 'v3',
		auth: oauth2Client
	})

	let eventStartTime = new Date()
	console.log({ a: eventStartTime.getDay() })

	eventStartTime.setDate(eventStartTime.getDay() + 5)

	let eventEndTime = new Date()
	eventEndTime.setDate(eventEndTime.getDay() + 5)
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
	res.send('WELCOME TO GET INBOX')
	res.render('page')
}