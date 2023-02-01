'use strict'

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	// async up(queryInterface, Sequelize) {
	async up(queryInterface) {
		/**
	 * Add altering commands here.
	 *
	 * Example:
	 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
	 */
		if (process.env.NODE_ENV == 'development') {
			await queryInterface.createDatabase('sw_dev_db').done()
		} else if (process.env.NODE_ENV == 'test') {
			await queryInterface.createDatabase('sw_test_db').done()
		} else if (process.env.NODE_ENV == 'production') {
			await queryInterface.createDatabase('sw_prod_db').done()
		}
	},

	// async down(queryInterface, Sequelize) {
	async down(queryInterface) {
		/**
	 * Add reverting commands here.
	 *
	 * Example:
	 * await queryInterface.dropTable('users');
	 */
		if (process.env.NODE_ENV == 'development') {
			await queryInterface.dropDatabase('sw_dev_db').done()
		} else if (process.env.NODE_ENV == 'test') {
			await queryInterface.dropDatabase('sw_test_db').done()
		} else if (process.env.NODE_ENV == 'production') {
			await queryInterface.dropDatabase('sw_prod_db').done()
		}
	}
}
