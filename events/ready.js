const keepAlive = require('../server');
const lib = require('../util/lib.js');
// const { Users, CurrencyShop, UserItems, userCollection } = require('../dbObjects');

module.exports = async (client) => {
  // const storedBalances = await Users.findAll();
  // storedBalances.forEach(b => {
  //   userCollection.set(b.user_id, b)
  // });
  keepAlive();
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(getRandomStatus());
  setInterval(function (){
    client.user.setActivity(getRandomStatus());
  }, 420000);
}

function getRandomStatus(){
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