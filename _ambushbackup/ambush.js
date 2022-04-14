/*
TO DO:

Be able to select from 6 randomly selected characters rather than being assigned 3 arbitrary ones.

New Characters:
- Phoenix
- Slime
- Griffin
- Chimera
- Sea Serpent
- Elf
- Nine-tailed Fox (Kitsune)

Ideas:
- Separate Ability from moves, some characters have no abilites, some have one ability, such as strong defense that boosts defense
- Moves have a particular typing, and each Class is weak to a set of types
*/

const Discord = require('discord.js');
const colors = require('../util/colors.js');

// Loads Character Classes
const { Archer } = require('../ambushCharacters/archer.js');
const { Assassin } = require('../ambushCharacters/assassin.js');
const { Black_Cat } = require('../ambushCharacters/black_cat.js');
const { Dragon } = require('../ambushCharacters/dragon.js');
const { Frozen_Spirit } = require('../ambushCharacters/frozen_spirit.js');
const { Phantom } = require('../ambushCharacters/phantom.js');
const { Swordsman } = require('../ambushCharacters/swordsman.js');
const { Werewolf } = require('../ambushCharacters/werewolf.js');
const { Wizard } = require('../ambushCharacters/wizard.js');

module.exports.run = async (client, message, args) => {
  if (typeof message.mentions.users.first() === undefined) {
    message.reply('Invalid User. Type !ambush @user');
    return;
  }
  const opponent = message.mentions.users.first(); // Get opponent from @mentions
  if(typeof opponent === 'undefined') return message.channel.send('Send a valid mention.');
  //else if (opponent == message.author) return message.channel.send("Stand down! It was only yourself.")

  var editMsg;
  var turn = 0;
  var lastMove = '';
  const health = client.emojis.cache.get(ids.health);
  const sword = client.emojis.cache.get(ids.sword);
  const shield = client.emojis.cache.get(ids.shield);
  const ability = client.emojis.cache.get(ids.ability);


  function randObject(owner) {
    newObjects = [new Dragon(owner), new Wizard(owner), new Archer(owner), new Swordsman(owner), new Frozen_Spirit(owner), new Werewolf(owner),new Assassin(owner), new Phantom(owner), new Black_Cat(owner)];
    return newObjects[Math.floor(Math.random()*newObjects.length)];
  }
  // request permission to start game
  let embd = new Discord.MessageEmbed().setTitle("It's an ambush!").setDescription(`Type \`fight\` to defend yourself, or \`flee\` to escape!`)
  message.channel.send(`<@${opponent.id}>, uh oh..`, {embed: embd});
  
  const responses = ["flee","decline","deny","fight","accept"];
  await message.channel.awaitMessages(m => (m.author.id === opponent.id && responses.includes(m.content.toLowerCase())), { max: 1, time: 35000 }).then(collected => { //user has a 30s to accept or decline
    msg = collected.first().content.toLowerCase();
  }).catch(err=>{});

  if(typeof msg === 'undefined') return message.channel.send('There was no one there... (Timed Out)'); // If they time out, stop!
  else if (responses.indexOf(msg) < 3) return message.channel.send(`${opponent.username} avoided the ambush.`); //stop if they flee and say that the user fled.. 


  // Character objects
  var op1 =  randObject(opponent.username);
  var op2 =  randObject(opponent.username);
  var op3 =  randObject(opponent.username);
  var p1 =  randObject(message.author.username);
  var p2 =  randObject(message.author.username);
  var p3 =  randObject(message.author.username);

  let chars = [op1,op2,op3,p1,p2,p3];
  
  chars.forEach((character) => {
    character.objects = chars; // lets all character objects be accessible to all characters
  });

  const player1 = [p1,p2,p3];
  const player2 = [op1,op2,op3];


  // Gamestate functions
  function getDescription(){
    return `**Turn** ${turn}`;
  }

  function getField1() {
    let p1obj1 = p1.isDead ? `❌ DEAD` : `${p1.type}: ${health}${p1.health}/${p1.maxhealth}\n${ability} ${p1.ability} \u200b 🎯 ${isNaN(p1.accuracy)? "N/A" : p1.accuracy - p1.black_cat_debuff - p1.tempacc_debuff}`;
    let p1obj2 = p2.isDead ? `❌ DEAD` : `${p2.type}: ${health}${p2.health}/${p2.maxhealth}\n${ability} ${p2.ability} \u200b 🎯 ${isNaN(p2.accuracy)? "N/A" : p2.accuracy - p2.black_cat_debuff - p2.tempacc_debuff}`;
    let p1obj3 = p3.isDead ? `❌ DEAD` : `${p3.type}: ${health}${p3.health}/${p3.maxhealth}\n${ability} ${p3.ability} \u200b 🎯 ${isNaN(p3.accuracy)? "N/A" : p3.accuracy - p3.black_cat_debuff - p3.tempacc_debuff}`;
    return `(1) ${p1obj1}\n\n(2) ${p1obj2}\n\n(3) ${p1obj3}`;
  }

  function getField2() {
    let p2obj1 = op1.isDead ? `❌ DEAD` : `${op1.type}: ${health}${op1.health}/${op1.maxhealth}\n${ability} ${op1.ability} \u200b 🎯 ${isNaN(op1.accuracy)? "N/A" : op1.accuracy - op1.black_cat_debuff - op1.tempacc_debuff}`;
    let p2obj2 = op2.isDead ? `❌ DEAD` : `${op2.type}: ${health}${op2.health}/${op2.maxhealth}\n${ability} ${op2.ability} \u200b 🎯 ${isNaN(op2.accuracy)? "N/A" : op2.accuracy - op2.black_cat_debuff - op2.tempacc_debuff}`;
    let p2obj3 = op3.isDead ? `❌ DEAD` : `${op3.type}: ${health}${op3.health}/${op3.maxhealth}\n${ability} ${op3.ability} \u200b 🎯 ${isNaN(op3.accuracy)? "N/A" : op3.accuracy - op3.black_cat_debuff - op3.tempacc_debuff}`;
    return `(1) ${p2obj1}\n\n(2) ${p2obj2}\n\n(3) ${p2obj3}`;
  }

  function checkWin() {
    // Check for winner
    let winner; let win = false;
    if(p1.isDead && p2.isDead && p3.isDead) { // opponent wins
      win = true;
      winner = opponent.username;
    }
    else if(op1.isDead && op2.isDead && op3.isDead) { // player wins
      win = true;
      winner = message.author.username;
    }
    return {win: win, winner: winner}
  }

  // Edits message with parameters from gamestate functions
  function doEditMsg(turn) {
    checkwin = checkWin();
    win = checkwin.win;
    winner = checkwin.winner
    if(win) {
      editMsg.edit(new Discord.MessageEmbed()
        .setTitle(`⚔️ Ambush! ${winner} wins.`)
        .setDescription(getDescription())
        .setFooter(`${winner} is the winner.`)
        .setColor(colors.red)
        .setAuthor(`${message.author.username} and ${opponent.username}'s Game`)
        .addField(message.author.username, getField1(), true)
        .addField('\u200b','\u200b', true) // empty field
        .addField(opponent.username, getField2(), true)
      );
    }
    else {
      editMsg.edit(new Discord.MessageEmbed()
        .setTitle(`⚔️ Ambush! ${(turn === 0)? message.author.username:opponent.username}'s turn.`)
        .setDescription(getDescription())
        .setFooter(lastMove)
        .setColor(colors.orange)
        .setAuthor(`${message.author.username} and ${opponent.username}'s Game`)
        .addField(`${(turn === 0)? shield:sword} ${message.author.username}`, getField1(), true)
        .addField('\u200b','\u200b', true)
        .addField(`${(turn === 0)? sword:shield} ${opponent.username}`, getField2(), true)
      );
    }
  }

  // Sends empty embed, saves as editMsg for later editing
  await message.channel.send(new Discord.MessageEmbed()).then(embd => {
    editMsg = embd;
  });

  var msg;
  while(true) {
    op1.update(); op2.update(); op3.update();
    p1.update(); p2.update(); p3.update();
    doEditMsg(0); // Update Gamestate
    if(checkWin().win) return; // Check for winner
    while(true) { // Player 1's turn
      await message.channel.awaitMessages(m => (m.author.id === message.author.id) || (m.author.id === opponent.id), { max: 1, time: 200000 }).then(collected => {
        // collects messages from either player so that either player can refresh or end
        msg = collected.first();
        if(msg.content.startsWith('attack') || msg.content.startsWith('end')) collected.first().delete();
      }).catch((err) => {
        message.channel.send('You timed out.');
        return;
      });
      if (typeof msg === 'undefined'){
        return;
      }
      else if (msg.author.id === message.author.id && msg.content.startsWith('attack')) { // If Player 1 says attack,
        let args = msg.content.split(' ');
        args.shift();
        if(args[0] > 0 && args[0] <= 3 && args[1] > 0 && args[1] <= 3){
          let player_character = player1[parseInt(args[0])-1];
          let opposing_character = player2[parseInt(args[1])-1];
          if (player_character.isDead) message.channel.send('That character is dead and can no longer be used.');
          else if (opposing_character.isDead) message.channel.send('That target is already dead. Why would you attack it again?')
          else {
            player_character.attack(opposing_character);
            lastMove = player_character.lastMove;
            break;
          }
        }
        else {
          // message badly formatted
          message.channel.send('Type `attack "1/2/3" "1/2/3"`')
        }
      }
      else if (msg.content === 'end') { // If either p1 or p2 says end
        // End game
        message.channel.send('Game Ended.')
        return;
      }
      else if (['r','re','refresh','!r','!refresh','!re'].includes(msg.content)) { // if either p1 or p2 refreshes
        // refresh embed (delete, resend, update)
        editMsg.delete();
        await message.channel.send(new Discord.MessageEmbed()).then(embd => {
          editMsg = embd;
        });
        doEditMsg(0) // 0: first player's turn
      }
      else if(msg.author.id === message.author.id){
        // message badly formatted
        message.channel.send('Type `attack "1/2/3" "1/2/3"`')
      }
    }

    doEditMsg(1); // Update Gamestate
    if(checkWin().win) return; // Check for winner
    // player2 retaliates
    msg = '';
    while(true) { // loops until valid input has been receieved
      await message.channel.awaitMessages(m => (m.author.id === opponent.id) || (m.author.id === message.author.id), { max: 1, time: 200000 }).then(collected => {
        msg = collected.first();
        if(msg.content.startsWith('attack')) msg.delete(); // if its an attack, delete the message
      }).catch((err) => {
        message.channel.send('You timed out.');
        return;
      });
      if (typeof msg === 'undefined') return;// If mo message was reveieved, end game without finishing (i.e awaitMessages timed out)
      else if (msg.author.id === opponent.id && msg.content.startsWith('attack')) { // If message starts with attack, check for valid arguments
        turn += 1;
        let args = msg.content.split(' ');
        args.shift(); // removes "attack" from beginning of args
        if(args[0] > 0 && args[0] <= 3 && args[1] > 0 && args[1] <= 3){ // If arguments are valid, check if requested characters are dead
          let opposing_character = player1[parseInt(args[1])-1];
          let player_character = player2[parseInt(args[0])-1];
          if (player_character.isDead) message.channel.send('That character is dead and can no longer be used.');
          else if (opposing_character.isDead) message.channel.send('That target is already dead. Why would you attack it again?');
          else{ // If requested players are still alive, finally attack.
            player_character.attack(opposing_character);
            lastMove = player_character.lastMove;
            break;
          }
        }
        else message.channel.send('Type `attack "1/2/3" "1/2/3"`');// If the arguments are invalid, tell the user and restart the loop
      }
      else if (msg.content === 'end') return message.channel.send('Game Ended.')// end game if user requests
      else if (['r','re','refresh','!r','!refresh','!re'].includes(msg.content)) { // refresh embed in case people talk
        // refresh embed
        editMsg.delete();
        await message.channel.send(new Discord.MessageEmbed).then(embd => {
          editMsg = embd;
        });
        doEditMsg(1) // 1: second player's turn
      }
      else { // if user did not refresh, attack, or end, tell the user and restart the loop 
        message.channel.send('Type `attack "1/2/3" "1/2/3"`')
      }
    }
  }
}

module.exports.config = {
  name: 'ambush',
  aliases: []
};
