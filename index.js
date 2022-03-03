const Discord = require('discord.js');
const client = new Discord.Client();
require("dotenv").config();

// Load the bot's events and commands
require('./util/eventLoader')(client);
require('./util/commandLoader')(client);

// Log in
client.login("OTQ4ODI2MTgwNjcxMzc3NTE4.YiBdPQ.k-V7wUWSZ6QVYdQMDa09x09X5k0");