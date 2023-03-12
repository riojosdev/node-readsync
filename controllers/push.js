const creatError = require('http-errors')
const db = require('../models')
const webpush = require('web-push')
const { Op } = require('sequelize')

exports.syncNotifications = async (req, res, next) => {
	try {
		const { to_id, message } = req.body
		const { email } = req.payload

		if (!email) throw creatError.Unauthorized()
		console.log('❤️❤️❤️❤️: ', { to_id, message, email })

		let from_user_row
		await db.User.findOne({
			where: {
				email: email
			}
		}).then(res => {
			from_user_row = res
			console.log(`✅: ${res.fname}`)
		}).catch(err => {
			console.error(`❌: ${err}`)
		})

		let to_user_row
		await db.User.findByPk(to_id)
			.then(res => {
				to_user_row = res
				console.log(`✅: ${res}`)
			})
			.catch(err => {
				console.error(`❌: ${err}`)
			})

		await db.Push.create({
			sender: from_user_row.id,
			receiver: to_user_row.id,
			message: message,
			timestamp: new Date().toISOString(),
			status: 'synced'
		}).then(res => {
			console.log(`✅: ${res}`)
		}).catch(err => {
			console.error(`❌: ${err}`)
		})
	} catch (error) {
		next(error)
	}
}

exports.deliverPush = async (req, res, next) => {
	try {
		// get pushSubscription object
		const { subscription, user_id, publicKey, privateKey } = req.body
		console.log({ subscription, user_id })
		
		// send 201 - resource created
		res.status(201).json({})

		// create payload
		let payload_test
		await db.Push.findAll({
			where: {
				[Op.or]: [
					{ sender: user_id },
					{ receiver: user_id }
				],
				[Op.and]: [
					{ status: 'synced' }
				]
			}
		}).then(res => {
			payload_test = res
			console.log({ payload_test })
			// !FIXME: find better and efficient way to run this code, without using loops
			payload_test.forEach(async element => {
				await db.Push.update({ status: 'delivered' }, {
					where: {
						id: element.id
					}
				})
			})
		}).catch(err => console.error('❌: ', err))

		webpush.setVapidDetails(
			'mailto:example@yourdomain.org',
			publicKey,
			privateKey
		)

		// get each message sender details
		// send to service worker to display as push notification
		for (let index = 0; index < payload_test.length; index++) {
			const message = payload_test[index]
			// fetch public vapid key
			let sender
			await db.User.findAll({
				attributes: ['fname'],
				where: {
					id: message.sender
				}
			}).then(async res => {
				sender = res[0]
				console.log({ sender })

				const payload = JSON.stringify({ title: sender.fname, body: message.message })
				console.log(payload)

				await webpush.sendNotification(subscription, payload).catch(err => console.error('🦀🤖✅✅: ', err))
			})
		}
		// pass object into sendNotification
	} catch (error) {
		next(error)
	}
}

exports.inbox = async (req, res) => {
	res.render('inbox')
}