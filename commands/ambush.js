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
const requireAll = require('require-all');
const path = require('path');
const fs = require('fs');

// Loads Character Classes
const classes = {};
const files = requireAll({
    dirname: path.join(__dirname, '../ambushCharacters'),
    filter: /^(?![_-]).+\.js$/ // Gets all .js files in ambushCharacters dir that don't start with _ or -
});
for (const name in files) {
    classes[name.slice(0,name.length-3)] = files[name]; 
} 

// Assign emojis

module.exports.run = async (client, message, args) => {
    const health = client.emojis.cache.get(ids.health);
    const curse = client.emojis.cache.get("816760830754029658")
    const sword = client.emojis.cache.get(ids.sword);
    const shield = client.emojis.cache.get(ids.shield);
    const ability = client.emojis.cache.get(ids.ability);

    if (args[0] == "stats"){
        let file = fs.readFileSync("./storage/ambush.json", "utf8");
        let stats = JSON.parse(file);
        if (stats[message.author.id] == null) message.channel.send("You have not played any games of ambush yet!")
        return message.channel.send(`Wins: ${stats[message.author.id].wins}\nDefeats: ${stats[message.author.id].defeats}\nDraws: ${stats[message.author.id].draws}`)
    }
    const opponent = message.mentions.users.first(); // Get opponent from @mentions
    if(typeof opponent === 'undefined') return message.channel.send('Invalid User. Type !ambush @user');
    //else if (opponent == message.author) return message.channel.send("Stand down! It was only yourself.")

  var editMsg;
  var turn = 1;
  var lastMove = '';

  function randObject(owner) {
    randomize = []
    for (var i in classes){
      randomize.push(new classes[i](owner))
    }
    return randomize[Math.floor(Math.random()*randomize.length)];
  }

  // request permission to start game
  let embd = new Discord.MessageEmbed().setTitle("It's an ambush!").setDescription(`Type \`fight\` to defend yourself, or \`flee\` to escape!`)
  message.channel.send(`<@${opponent.id}>, uh oh..`, {embed: embd});
  
  const responses = ["flee","decline","deny","fight","accept"];
  await message.channel.awaitMessages(m => (m.author.id === opponent.id && responses.includes(m.content.toLowerCase())), { max: 1, time: 35000 }).then(collected => { //user has a 30s to accept or decline
    msg = collected.first().content.toLowerCase();
  }).catch(err=>{});

  if(typeof msg === 'undefined') return message.channel.send('They knew you were coming and fled! (Timed Out)'); // If they time out, stop!
  else if (responses.indexOf(msg) < 3) return message.channel.send(`${opponent.username} avoided the ambush.`); //stop if they flee and say that the user fled.. 

  // Character objects  
  const player1 = [];
  const player2 = [];
  for (var i = 0; i< ((isNaN(args[1])) ? 3 : (args[1] > 6 ? 6 : args[1])); i++){
      player1.push(randObject(message.author.username))
      player2.push(randObject(opponent.username))
  }
  chars = player1.concat(player2);
  chars.forEach((character) => {
    character.objects = chars; // lets all character objects be accessible to all characters 
  });


  // Gamestate functions
  function getField1() {
    let message = ""
    for (var index in player1){
        message += "(" + (parseInt(index)+1) + ") " + (player1[index].isDead ? `❌ DEAD\n\n` : `${player1[index].type}: ${player1[index].statuses.includes("Cursed") ? curse : health}${player1[index].health}/${player1[index].maxhealth}\n${ability} ${player1[index].ability} \u200b 🎯 ${isNaN(player1[index].accuracy)? "N/A" : player1[index].displayAccuracy()}\n\n`);
    }
    return message;
  }

  function getField2() {
    let message = ""
    for (var index in player2){
        message += "(" + (parseInt(index)+1) + ") " + (player2[index].isDead ? `❌ DEAD\n\n` : `${player2[index].type}: ${player2[index].statuses.includes("Cursed") ? curse : health}${player2[index].health}/${player2[index].maxhealth}\n${ability} ${player2[index].ability} \u200b 🎯 ${isNaN(player2[index].accuracy)? "N/A" : player2[index].displayAccuracy()}\n\n`);
    }
    return message;
  }

  function checkWin() {
      var opalive, palive  = false;
      for (var check in player1){
          if (!player1[check].isDead) palive = true;
          if (!player2[check].isDead) opalive = true;
      }
      if (opalive && palive) return {win: false, winner: null}
      if (!opalive && !palive) return {win:3,winner:"Draw"}
      else if (!palive) return {win: 1, winner:opponent.username}
      else return {win: 2, winner:message.author.username}
  }

    async function refresh(turn) {
           // refresh embed (delete, resend, update)
        editMsg.delete();
        await message.channel.send(new Discord.MessageEmbed()).then(embd => {
            editMsg = embd;
        });
        doEditMsg(turn)
    }

    function saveResults(winner){
        let file = fs.readFileSync("./storage/ambush.json", "utf8");
        let stats = JSON.parse(file);
        if (stats[message.author.id] == null) stats[message.author.id] = {"wins":0,"defeats":0,"draws":0}
        if (stats[opponent.id] == null) stats[opponent.id] = {"wins":0,"defeats":0,"draws":0}
        if (winner == 1) {
            stats[message.author.id].defeats++;
            stats[opponent.id].wins++;
        }
        else if (winner == 2) {
            stats[message.author.id].wins++;
            stats[opponent.id].defeats++;
        }
        else if (winner == 3){
            stats[message.author.id].draws++;
            stats[opponent.id].draws++;
        }
        fs.writeFile("./storage/ambush.json", JSON.stringify(stats), function(err) {console.log(err)})
    }

  // Edits message with parameters from gamestate functions
  function doEditMsg(turn) {
    checkwin = checkWin();
    win = checkwin.win;
    winner = checkwin.winner
    if(win) {
      editMsg.edit(new Discord.MessageEmbed()
        .setTitle(`⚔️ Ambush! ${winner} wins.`)
        .setDescription(`**Turn** ${Math.floor(turn)}`)
        .setFooter(`${winner} is the winner.`)
        .setColor(colors.red)
        .setAuthor(`${message.author.username} and ${opponent.username}'s Game`)
        .addField(message.author.username, getField1(), true)
        .addField('\u200b','\u200b', true) // empty field
        .addField(opponent.username, getField2(), true)
      );
      if (message.author.id != opponent.id) saveResults(win)
    }
    else {
      editMsg.edit(new Discord.MessageEmbed()
        .setTitle(`⚔️ Ambush! ${(Math.floor(turn) === turn)? message.author.username:opponent.username}'s turn.`)
        .setDescription(`**Turn** ${Math.floor(turn)}`)
        .setFooter(lastMove)
        .setColor(colors.orange)
        .setAuthor(`${message.author.username} and ${opponent.username}'s Game`)
        .addField(`${(Math.floor(turn) === turn)? shield:sword} ${message.author.username}`, getField1(), true)
        .addField('\u200b','\u200b', true) // empty field
        .addField(`${(Math.floor(turn) === turn)? sword:shield} ${opponent.username}`, getField2(), true)
      );
    }
  }
  

  // Sends empty embed, saves as editMsg for later editing
  await message.channel.send(new Discord.MessageEmbed().setDescription("_ _")).then(embd => {
    editMsg = embd;
  });

  var msg;
  while(true) {
        if ((Math.floor(turn) === turn)){
            for (var i in player1){
                player1[i].update();
                player2[i].update();
            }
        }

    doEditMsg(turn); // Update Gamestate
    if(checkWin().win) return; // Check for winner
    
    while(true) { // Player 1's turn aka message.author.id
        await message.channel.awaitMessages(m => (m.author.id === message.author.id) || (m.author.id === opponent.id), { max: 1, time: 200000 }).then(collected => {
            // collects messages from either player so that either player can refresh or end
            msg = collected.first();
            if(msg.content.startsWith('attack') || msg.content.startsWith('swap')) collected.first().delete();
        }).catch((err) => {return message.channel.send('You timed out.');});
        if (typeof msg === 'undefined') return;
        currentTurn = ((Math.floor(turn) === turn)? message.author.id : opponent.id)
        if (msg.author.id === currentTurn && msg.content.startsWith('attack')) { // If it is player's turn and they attack
            let args = msg.content.split(' ');
            args.shift();
            if(args[0] > 0 && args[0] <= player1.length && args[1] > 0 && args[1] <= player1.length){
                var attack = (Math.floor(turn) === turn) ? player1 : player2 //figure out which array to use
                var defend = (Math.floor(turn) === turn) ? player2 : player1 //figure out which array to use
                turn += 0.5;
                let player_character = attack[parseInt(args[0])-1];
                let opposing_character = defend[parseInt(args[1])-1];
                if (player_character.isDead) message.channel.send('That character is dead and can no longer be used.');
                else if (opposing_character.isDead) message.channel.send('That target is already dead. Why would you attack it again?')
                else {
                    player_character.super_attack(opposing_character);
                    lastMove = player_character.lastMove;
                    break;
                }
            }
            else message.channel.send('Type `attack "1/2/3" "1/2/3"`')// message badly formatted
        }
        else if (msg.author.id === currentTurn && msg.content.startsWith('swap')) {
            lastMove = "";
            var array = (Math.floor(turn) === turn) ? player1 : player2 //figure out which array to use
            turn += 0.5;
            let args = msg.content.split(' ');
            args.shift();
            for (var i in args){
                if(args[i] > 0 && args[i] <= player1.length){
                    let swapping = array[parseInt(args[i])-1];
                    if (swapping.isDead) message.channel.send('That character is dead and can no longer be used.');
                    else {
                        swapping.swap();
                        lastMove += swapping.owner + "\'s " + swapping.type + " swapped it\'s ability to " + swapping.ability +"\n"
                    }
                }
            }
            break;
        }
      else if (msg.content === 'end') return message.channel.send('The Game Ended.') // If either player says end, end the game.
      else if (['r','re','refresh','!r','!refresh','!re'].includes(msg.content)) refresh(turn)// if either player1[0] or player1[1] refreshes
      else if(msg.author.id === currentTurn) message.channel.send('Type `attack "1/2/3" "1/2/3"`') // message badly formatted
    }
  }
}

module.exports.config = {
  name: 'ambush',
  aliases: ["potato"]
};