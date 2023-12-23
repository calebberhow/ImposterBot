import keepAlive from '../server.js';
import lib from '../util/lib.js';
import { Events } from 'discord.js';
import EventHandler from './Infrastructure/EventHandler.js';
import chalk from 'chalk';
import ServiceClient from '../ServiceClient.js';

async function OnReady(client: ServiceClient)
{
  console.log(chalk.green(`Logged in as ${chalk.cyan(client.user.tag)}!`));
  await client.Services.ApplicationCommands.Publish(client);

  keepAlive();
  client.user.setActivity(getRandomStatus());
  setInterval(function (){
    client.user.setActivity(getRandomStatus());
  }, 420000);
}

function getRandomStatus() {
    return lib.randMessage(
        [["as imposter",4],
        ["Among Us",4],
        ["in the vents",4],
        ["moderating Cozy Cosmos",2],
        ["Simon Says in Reactor",2],
        ["games to avoid tasks",1.5],
        "with a snowman",
        "with their pet robot",
        "Town of Salem", 
        "Minecraft",
        "League of Legends",
        "suspenseful music",
        ["Pokémon: Shiny Hunting",0.25], 
        ["Pokémon GO",0.25],
        ]) + " | !commands";
}

export default new EventHandler(Events.ClientReady, OnReady);