const creatError = require('http-errors')
const client = require('../utils/db')

exports.getUser = async (req, res, next) => {
	try {
		console.log('🦀🦀🦀: ', req.payload)
		// const { user } = req.body
		console.log({ requestssss: req.body })
		// checking for any error occurance
		const { email } = req.payload

		if (!email) throw creatError.Unauthorized()

		// let user
		// !FIXME: reveal only connected-friend-users in personal network
		// const query = `SELECT * FROM users WHERE email='${email}';`
		// const query = `SELECT * FROM users WHERE id='${user.id}';`
		const query = 'SELECT * FROM users;'
		await client.query(query)
			.then(res => {
				// user = res.rows
				return res.rows
			})
			.then(data => {
				console.log({ data })
				res.status(200).json({ user: data, email })
			})

	} catch (error) {
		next(error)
	}
}