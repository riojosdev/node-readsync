const dotenv = require('dotenv')

dotenv.config()

module.exports = {
	development: {
		username: process.env.DEV_DB_USERNAME,
		password: process.env.DEV_DB_PASSWORD,
		database: process.env.DEV_DB_NAME,
		host: process.env.DEV_DB_HOSTNAME,
		port: process.env.DEV_DB_PORT,
		dialect: 'postgres',
		dialectOptions: {
			bigNumberStrings: true,
		}
	},
	test: {
		username: process.env.CI_DB_USERNAME,
		password: process.env.CI_DB_PASSWORD,
		database: process.env.CI_DB_NAME,
		host: process.env.CI_DB_HOSTNAME,
		port: process.env.CI_DB_PORT,
		dialect: 'postgres',
		dialectOptions: {
			bigNumberStrings: true,
			ssl: {
				require: true,
				rejectUnauthorized: false
			}
		},
	},
	production: {
		username: process.env.PROD_DB_USERNAME,
		password: process.env.PROD_DB_PASSWORD,
		database: process.env.PROD_DB_NAME,
		host: process.env.PROD_DB_HOSTNAME,
		port: process.env.PROD_DB_PORT,
		dialect: 'postgres',
		dialectOptions: {
			bigNumberStrings: true,
			// !FIXME: Production needs SSL certificate
		}
	}
}