const { Users, CurrencyShop, UserItems, userCollection } = require('../dbObjects');

module.exports.run = async (client, message, args) => {
  if(message.author.id === "318195473364156419" || message.author.id === '193136312759353344') {
    var target = message.mentions.users.first() || message.author;
    try{
      userCollection.add(target.id,parseInt(args));
    }
    catch {
      message.channel.send('Invalid Number');
    }
  } else console.log(`add command failed for ${message.author.tag}`);
}

module.exports.config = {
  name: 'add',
  aliases: ['cheat']
};