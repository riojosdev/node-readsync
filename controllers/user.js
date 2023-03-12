const creatError = require('http-errors')
const db = require('../models')

exports.getUser = async (req, res, next) => {
	try {
		console.log('🦀🦀🦀: ', req.payload)
		console.log({ requestssss: req.body })
		// checking for any error occurance
		const { email } = req.payload

		if (!email) throw creatError.Unauthorized()

		// !FIXME: reveal only connected-friend-users in personal network
		await db.User.findAll().then(data =>{
			console.log({ data })
			res.status(200).json({ user: data, email })
		})
	} catch (error) {
		next(error)
	}
}