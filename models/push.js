'use strict'
const {
	Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Push extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate() {
			// define association here
			// Push.belongsTo(models.User)
		}
	}
	Push.init({
		message: DataTypes.STRING,
		timestamp: DataTypes.DATE,
		status: DataTypes.ENUM('waiting', 'synced', 'delivered', 'retry')
	}, {
		sequelize,
		modelName: 'Push',
	})
	return Push
}