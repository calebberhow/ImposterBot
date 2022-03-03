const Sequelize = require('sequelize');
const ids = require('./ids.json')
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './database.sqlite',
});

// Loading the models
const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
require('./models/Users')(sequelize, Sequelize.DataTypes);
require('./models/UserItems')(sequelize, Sequelize.DataTypes);

// Destroy all shop items,
CurrencyShop.findAll().then(async (items) => {
  await items.forEach((i) => {
    i.destroy();
  });
  // Then create new ones
  sequelize.sync().then(async () => {
    // List of promises to create new shop items
    const shopPromises = [
      CurrencyShop.create({ name: 'Cake Badge', cost: 35, emojiID: ids.cakeEmoji }),
      CurrencyShop.create({ name: 'Chicken Badge', cost: 35, emojiID: ids.chickenEmoji }),
      CurrencyShop.create({ name: 'Dragon Badge', cost: 40, emojiID: ids.dragonEmoji }),
      CurrencyShop.create({ name: 'Rainbow Heart Badge', cost: 40, emojiID: ids.rainbowHeartEmoji }),
      CurrencyShop.create({ name: 'Crewmate Badge', cost: 40, emojiID: ids.crewmateEmoji }),
      CurrencyShop.create({ name: 'ToS Badge', cost: 40, emojiID: ids.tosEmoji }),
      CurrencyShop.create({ name: 'Ambush Badge', cost: 120, emojiID: ids.ambushEmoji }),
      CurrencyShop.create({ name: 'Cosmos Badge', cost: 200, emojiID: ids.cosmosEmoji }),
      CurrencyShop.create({ name: 'Gold Badge', cost: 500, emojiID: ids.coinEmoji }),
      CurrencyShop.create({ name: 'Diamond Badge', cost: 1000, emojiID: ids.diamondEmoji }),
    ];
    // Wait for each of the upsert promises before continuing
    await Promise.all(shopPromises);
    console.log('Database synced');
    sequelize.close();
  }).catch(console.error);
});