colors = require('../util/colors.js');

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
    time_of_last_daily: {
      type: DataTypes.DATE,
    },
    description : {
      type: DataTypes.STRING,
      defaultValue: 'Use !description to set your description'
    },
    color: {
      type: DataTypes.INTEGER,
      defaultValue: colors.slate,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
	}, {
		timestamps: false,
	});
};