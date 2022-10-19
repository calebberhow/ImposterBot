const Discord = require('discord.js');
const client = new Discord.Client();
require("dotenv").config();


// Load the bot's events and commands
require('./util/eventLoader')(client);
require('./util/commandLoader')(client);

// Log in
client.login(process.env.CLIENT_TOKEN);
