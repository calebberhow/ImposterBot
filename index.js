const { Client, GatewayIntentBits } = require('discord.js');
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load the bot's events (slash commands invoke interactionCreate event)
require('./util/eventLoader')(client);

// require('./util/commandLoader')(client);

// Log in
client.login(process.env.CLIENT_TOKEN);
