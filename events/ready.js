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
        ["as imposter", //4
        "Among Us", //4
        "in the vents", //4
        "moderating Cozy Cosmos", //2
        "Simon Says in Reactor", //2
        "games to avoid tasks", //1.5  
        "with a snowman", //1
        "with their pet robot", //1
        "Town of Salem", //1 
        "Minecraft", //1
        "League of Legends", //1
        "suspenseful music", //1
        "Pokémon: Shiny Hunting", //0.25 
        "Pokémon GO", //0.25
        ],
        [4,4,4,2,2,1.5,1,1,1,1,1,1,0.25,0.25]) + " | !commands";
}