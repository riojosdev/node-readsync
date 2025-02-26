const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const { sequelize } = require('./models')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

// Set up global configuration access
dotenv.config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'pug')
app.use(express.static('views'))

app.use('/', authRoutes)
app.use('/', userRoutes)

// error handling
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
/* eslint-enable no-unused-vars */
	res.status(err.status || 500).send({
		error: {
			status: err.status || 500,
			message: err.message
		}
	})
})


const port = process.env.PORT || 3000

app.listen(port, async () => {
	console.log(`Example app listening on port ${port}`)
	sequelize.sync({ force: false }).then(() => {
		console.log('✅: Synced database successfully...')
	})
})