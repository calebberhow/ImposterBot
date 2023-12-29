import { GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import EventLoader from "./util/eventLoader.js";
import ServiceClient from "./ServiceClient.js";
import { PublishType } from "./Services/ApplicationCommands.js";

const client = new ServiceClient(
  {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildVoiceStates,
    ]
  });

dotenv.config();

// Debug Application Commands (entirely disable global commands, publish server-specific commands)
client.Services.ApplicationCommands.PublishType = PublishType.PublicOnly;

// Load the bot's events
EventLoader(client);

// Log in
client.login(process.env.CLIENT_TOKEN);
