const keepAlive = require('../server');
const lib = require('../util/lib.js');
const requireAll = require('require-all');
const path = require('path');

module.exports = async (client) => {

  // Must be here because client.user.id does NOT exist until the bot is logged in.
  const ws_commands = requireAll({
    dirname: path.join(__dirname, '../commands_ws'),
    filter: /^(?!-)(.+)(?<!.test)\.js$/
  });

  for (const name in ws_commands) {
      const cmd = ws_commands[name];

      await client.api.applications(client.user.id).guilds(ids.serverID).commands.post({
          data: {
              name: cmd.name,
              description: cmd.description,
              options: cmd.options,
          },
    });
  }

  keepAlive();
  console.log(`Logged in as ${client.user.tag}!`);
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