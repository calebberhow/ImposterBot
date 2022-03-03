const Discord = require('discord.js');
const client = new Discord.Client();

// Load the bot's events and commands
require('./util/eventLoader')(client);
require('./util/commandLoader')(client);

// Log in
// client.login(process.env.TOKEN);
client.login('OTQ4ODI2MTgwNjcxMzc3NTE4.YiBdPQ.VwGuvYEG1u9vILcBDIJ7J3y5RGM');