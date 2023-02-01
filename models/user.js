'use strict'
const {
	Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
			User.hasOne(models.Push, {
				foreignKey: 'sender'
			})
			User.hasOne(models.Push, {
				foreignKey: 'receiver'
			})
		}
	}
	User.init({
		fname: DataTypes.STRING,
		lname: DataTypes.STRING,
		mobile: DataTypes.BIGINT,
		email: DataTypes.STRING,
		publicID: DataTypes.STRING,
		privateID: DataTypes.STRING,
		dob: DataTypes.DATEONLY
	}, {
		sequelize,
		modelName: 'User',
	})
	return User
}