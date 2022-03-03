const Sequelize = require('sequelize');
const Discord = require('discord.js')
const colors = require('./util/colors.js')
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const userCollection = new Discord.Collection();

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

Users.prototype.addItem = async function(item) {
  // Find all items of this type that the user already has
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});
  // If there are any, increment the amount, then save.
	if (userItem) {
		userItem.amount += 1;
		return userItem.save();
	}
  // If there are none, create a new user item.
	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1, emojiID: item.emojiID });
};

Users.prototype.getItems = function() {
  // Finds all items of a particular user
	return UserItems.findAll({
		where: { user_id: this.user_id },
		include: ['item'],
	});
};



Reflect.defineProperty(userCollection, 'add', {
	value: async function(id, amount) {
		const user = userCollection.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount, time_of_last_daily: new Date(), experience: 0, level: 0 });
		userCollection.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(userCollection, 'givexp', {
	value: async function(id, amount) {
		const user = userCollection.get(id);
		if (user) {
			user.experience += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: 0, time_of_last_daily: new Date(), experience: amount, level: 0 });
		userCollection.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(userCollection, 'getBalance', {
	value: function(id) {
		const user = userCollection.get(id);
		return user ? user.balance : 0;
	},
});

Reflect.defineProperty(userCollection, 'getColor', {
	value: function(id) {
		const user = userCollection.get(id);
		return user ? user.color : colors.slate;
	},
});

Reflect.defineProperty(userCollection, 'getxp', {
	value: function(id) {
		const user = userCollection.get(id);
		return user ? user.experience : 0;
	},
});

Reflect.defineProperty(userCollection, 'getLevel', {
	value: function(id) {
		const user = userCollection.get(id);
		return user ? user.level : 0;
	},
});

Reflect.defineProperty(userCollection, 'timeSinceDaily', {
	value: async (id) => {
		const user = userCollection.get(id);
    if (user) {
		  let lastTime = user.time_of_last_daily;
      let currentTime = new Date();
      return (currentTime - lastTime)/1000
    }
    else {
      const newUser = await Users.create({ user_id: id, balance: 0, time_of_last_daily: new Date(), experience: 0, level: 0 });
		  userCollection.set(id, newUser);
      return 86400
    }
	},
});

Reflect.defineProperty(userCollection, 'setDaily', {
	value: async function(id) {
		const user = userCollection.get(id);
		user.time_of_last_daily = new Date();
		return user.save();
	},
});

module.exports = { Users, CurrencyShop, UserItems, userCollection };