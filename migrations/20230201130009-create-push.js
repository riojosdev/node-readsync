'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Pushes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			message: {
				type: Sequelize.STRING,
				allowNull: false
			},
			timestamp: {
				type: Sequelize.DATE,
				allowNull: false
			},
			status: {
				type: Sequelize.ENUM('waiting', 'synced', 'delivered', 'retry'),
				allowNull: false,
				defaultValue: 'waiting'
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
		await queryInterface.dropTable('Pushes')
	}
}