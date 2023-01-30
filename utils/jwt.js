const jwt = require('jsonwebtoken')
const creatError = require('http-errors')
module.exports = {
	signJwtToken: (data, { secret, expiresIn }) => {
		return new Promise((resolve, reject) => {

			// options also takes in algorithm (default: HS256)
			// Another algorithm we can use is RS256 which require a pair of pvt/pub key
			const options = {
				expiresIn,
				algorithm: 'HS256'
			}

			jwt.sign(data, secret, options, (err, token) => {
				if (err) return reject(creatError.InternalServerError())
				resolve(token)
			})
		})
	},
	// verify tokens
	verifyJwtToken: ({ token, secret }) => {
		return new Promise((resolve, reject) => {

			jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, payload) => {
				if (err) {
					const message = err.name === 'TokenExpiredError' ? err.message : 'Unauthorized'
					return reject(creatError.NotAcceptable(message))
				}
				resolve(payload)
			})
		})
	}
}