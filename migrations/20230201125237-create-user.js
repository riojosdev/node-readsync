'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			fname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			lname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			mobile: {
				type: Sequelize.BIGINT,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			publicID: {
				type: Sequelize.STRING,
				allowNull: false
			},
			privateID: {
				type: Sequelize.STRING,
				allowNull: false
			},
			dob: {
				type: Sequelize.DATEONLY,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		})
	},
	async down(queryInterface) {
		await queryInterface.dropTable('Users')
	}
}