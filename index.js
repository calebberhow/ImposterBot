import discord from "discord.js";
import dotenv from "dotenv";
import eventLoader from "./util/eventLoader.js";
import commandLoader from "./util/commandLoader.js";

const client = new discord.Client({intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages
]});

dotenv.config();


// Load the bot's events and commands
eventLoader(client);
commandLoader(client);

// Log in
client.login(process.env.CLIENT_TOKEN);
