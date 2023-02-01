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

		// 	const from_user = `
		// SELECT * FROM "Users" 
		// WHERE email='${email}';`
		let from_user_row
		// await db.sequelize.query(from_user)
		await db.User.findOne({
			where: {
				email: email
			}
		})
			.then(res => {
				from_user_row = res
				console.log(`✅: ${res.fname}`)
			})
			.catch(err => {
				console.error(`❌: ${err}`)
			})

		// 	const to_user = `
		// SELECT * FROM "Users" 
		// WHERE id=${to_id};
		// `
		let to_user_row
		// await db.sequelize.query(to_user)
		await db.User.findByPk(to_id)
			.then(res => {
				to_user_row = res
				console.log(`✅: ${res}`)
			})
			.catch(err => {
				console.error(`❌: ${err}`)
			})


		// 	const query = `
		// INSERT INTO "Pushes" (sender, receiver, message, timestamp, status)
		// VALUES ($1, $2, $3, $4, $5);`
		// 	const values = [from_user_row.id, to_user_row.id, message, new Date().toISOString(), 'synced']

		// await db.sequelize.query(query, values)
		await db.Push.create({
			sender: from_user_row.id,
			receiver: to_user_row.id,
			message: message,
			timestamp: new Date().toISOString(),
			status: 'synced'
		})
			.then(res => {
				console.log(`✅: ${res}`)
			})
			.catch(err => {
				console.error(`❌: ${err}`)
			})
		// .finally(() => {
		//     db.sequelize.end();
		// })


		// res.send("SYNCED message to SERVER")
		// res.render('worker')

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

		// let user_id = 1

		// create payload
		let payload_test
		// 	const query = `
		// SELECT * FROM "Pushes" WHERE (sender=${user_id} OR receiver=${user_id}) AND status='synced';`
		// await db.sequelize.query(query)
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
		})
			.then(res => {
				payload_test = res
				console.log({ payload_test })
				// !FIXME: find better and efficient way to run this code, without using loops
				payload_test.forEach(async element => {
					// const query2 = `UPDATE "Pushes" SET status='delivered' WHERE id='${element.id}';`
					// await db.sequelize.query(query2)
					await db.Push.update({ status: 'delivered' }, {
						where: {
							id: element.id
						}
					})
				})
				// db.sequelize.query(query2)
				//     .then(res => {
				//         return res.rows
				//     })
			})
			.catch(err => console.error('❌: ', err))

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
			const key_query = `SELECT fname FROM "Users" WHERE id=${message.sender}`
			await db.sequelize.query(key_query)
				.then(async res => {
					sender = res.rows
					console.log({ sender })

					const payload = JSON.stringify({ title: JSON.stringify(sender, message.message), body: JSON.stringify(message.message) })

					console.log(payload)

					await webpush.sendNotification(subscription, payload).catch(err => console.error('🦀🤖✅✅: ', err))
				})


		}



		// pass object into sendNotification
	} catch (error) {
		next(error)
	}
}