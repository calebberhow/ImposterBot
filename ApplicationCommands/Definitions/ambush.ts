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

import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import colors from '../../util/colors.js';
import fs from 'fs';
import chalk from 'chalk';
import { IDs } from '../../ids_manager.js';
import Archer from '../../ambushCharacters/archer.js';
import Assassin from '../../ambushCharacters/assassin.js';
import Dragon from '../../ambushCharacters/dragon.js';
import Phantom from '../../ambushCharacters/phantom.js';
import Werewolf from '../../ambushCharacters/werewolf.js';
import Wizard from '../../ambushCharacters/wizard.js';
import ServiceClient from '../../ServiceClient.js';
import { Character, Statuses } from '../../ambushCharacters/Character.js';
import ApplicationCommand from '../Infrastructure/ApplicationCommand.js';

// Loads Character Classes
const classes = { Archer: Archer, Assassin: Assassin, Dragon: Dragon, Phantom: Phantom, Werewolf: Werewolf, Wizard: Wizard };

async function run(client: ServiceClient, interaction: ChatInputCommandInteraction): Promise<void>
{
  // Assign emojis
  const health = client.emojis.cache.get(IDs.health);
  const curse = client.emojis.cache.get("816760830754029658");
  const sword = client.emojis.cache.get(IDs.sword);
  const shield = client.emojis.cache.get(IDs.shield);
  const ability = client.emojis.cache.get(IDs.ability);

  // todo: refactor
  if (interaction.options.getSubcommand() == 'stats')
  {
    let file = fs.readFileSync("./storage/ambush.json", "utf8");
    let stats = JSON.parse(file);
    if (stats[interaction.user.id] == null) 
    {
      interaction.reply("You have not played any games of ambush yet!");
      return;
    }

    interaction.reply(`Wins: ${stats[interaction.user.id].wins}\nDefeats: ${stats[interaction.user.id].defeats}\nDraws: ${stats[interaction.user.id].draws}`);
    return;
  }
  const opponent = interaction.options.getUser('target');

  var editMsg: Message;
  var turn = 1;
  var lastMove = '';

  function randCharacter(owner: string)
  {
    let choices: Array<Character> = [];
    for (var c in classes)
    {
      choices.push(new classes[c](owner));
    }

    return choices[Math.floor(Math.random() * choices.length)];
  }

  // request permission to start game
  let embd = new EmbedBuilder()
    .setTitle("It's an ambush!")
    .setDescription(`Type \`fight\` to defend yourself, or \`flee\` to escape!`);
  interaction.reply({ content: `<@${opponent.id}>, uh oh..`, embeds: [embd] });

  const responses = ["flee", "decline", "deny", "fight", "accept"];
  await interaction.channel.awaitMessages({ filter: m => (m.author.id === opponent.id && responses.includes(m.content.toLowerCase())), max: 1, time: 35000 })
    .then(collected =>
    { //user has a 30s to accept or decline
      msg = collected.first();
    }).catch(err => console.error(err));

  if (typeof msg === 'undefined') 
  {
    interaction.followUp('They knew you were coming and fled! (Timed Out)'); // If they time out, stop!
    return;
  }
  else if (responses.indexOf(msg.content.toLowerCase()) < 3) 
  {
    interaction.followUp(`${opponent.username} avoided the ambush.`); //stop if they flee and say that the user fled.. 
    return;
  }

  // Character objects  
  const player1: Array<Character> = [];
  const player2: Array<Character> = [];

  for (let i = 0; i < 3; i++)
  {
    player1.push(randCharacter(interaction.user.username));
    player2.push(randCharacter(opponent.username));
  }
  let chars: Array<Character> = player1.concat(player2);
  chars.forEach((character) => 
  {
    character.objects = chars; // lets all character objects be accessible to all characters 
  });

  // Gamestate functions
  function getField1()
  {
    let message = "";
    for (var index in player1)
    {
      message += "(" + (parseInt(index) + 1) + ") " + (player1[index].isDead ? `❌ DEAD\n\n` : `${player1[index].type}: ${player1[index].statuses.includes(Statuses.Cursed) ? curse : health}${player1[index].health}/${player1[index].maxhealth}\n${ability} ${player1[index].ability} \u200b 🎯 ${isNaN(player1[index].accuracy) ? "N/A" : player1[index].displayAccuracy()}\n\n`);
    }
    return message;
  }

  function getField2()
  {
    let message = "";
    for (var index in player2)
    {
      message += "(" + (parseInt(index) + 1) + ") " + (player2[index].isDead ? `❌ DEAD\n\n` : `${player2[index].type}: ${player2[index].statuses.includes(Statuses.Cursed) ? curse : health}${player2[index].health}/${player2[index].maxhealth}\n${ability} ${player2[index].ability} \u200b 🎯 ${isNaN(player2[index].accuracy) ? "N/A" : player2[index].displayAccuracy()}\n\n`);
    }
    return message;
  }

  function checkWin()
  {
    var opalive, palive = false;
    for (var check in player1)
    {
      if (!player1[check].isDead) palive = true;
      if (!player2[check].isDead) opalive = true;
    }
    if (opalive && palive) return { win: false, winner: null };
    if (!opalive && !palive) return { win: 3, winner: "Draw" };
    else if (!palive) return { win: 1, winner: opponent.username };
    else return { win: 2, winner: interaction.user.username };
  }

  async function refresh(turn)
  {
    // refresh embed (delete, resend, update)
    editMsg.delete();
    await interaction.channel.send({ embeds: [new EmbedBuilder()] }).then(embd =>
    {
      editMsg = embd;
    });
    doEditMsg(turn);
  }

  function saveResults(winner)
  {
    let file = fs.readFileSync("./storage/ambush.json", "utf8");
    let stats = JSON.parse(file);
    if (stats[interaction.user.id] == null) stats[interaction.user.id] = { "wins": 0, "defeats": 0, "draws": 0 };
    if (stats[opponent.id] == null) stats[opponent.id] = { "wins": 0, "defeats": 0, "draws": 0 };
    if (winner == 1)
    {
      stats[interaction.user.id].defeats++;
      stats[opponent.id].wins++;
    }
    else if (winner == 2)
    {
      stats[interaction.user.id].wins++;
      stats[opponent.id].defeats++;
    }
    else if (winner == 3)
    {
      stats[interaction.user.id].draws++;
      stats[opponent.id].draws++;
    }
    fs.writeFile("./storage/ambush.json", JSON.stringify(stats), function (err) { console.log(chalk.red(err)); });
  }

  // Edits message with parameters from gamestate functions
  function doEditMsg(turn)
  {
    let checkwin = checkWin();
    let win = checkwin.win;
    let winner = checkwin.winner;
    if (win)
    {
      let embed = new EmbedBuilder()
        .setTitle(`⚔️ Ambush! ${winner} wins.`)
        .setDescription(`**Turn** ${Math.floor(turn)}`)
        .setFooter({ text: `${winner} is the winner.` })
        .setColor(colors.red)
        .setAuthor({ name: `${interaction.user.username} and ${opponent.username}'s Game` })
        .addFields([
          { name: interaction.user.username, value: getField1(), inline: true },
          { name: '\u200b', value: '\u200b', inline: true }, // Empty Field
          { name: opponent.username, value: getField2(), inline: true },
        ]);

      editMsg.edit({ embeds: [embed] });
      if (interaction.user.id != opponent.id) saveResults(win);
    }
    else
    {
      let embed = new EmbedBuilder()
        .setTitle(`⚔️ Ambush! ${(Math.floor(turn) === turn) ? interaction.user.username : opponent.username}'s turn.`)
        .setDescription(`**Turn** ${Math.floor(turn)}`)
        .setColor(colors.orange)
        .setAuthor({ name: `${interaction.user.username} and ${opponent.username}'s Game` })
        .addFields([
          { name: `${(Math.floor(turn) === turn) ? shield : sword} ${interaction.user.username}`, value: getField1(), inline: true },
          { name: '\u200b', value: '\u200b', inline: true }, // Empty Field
          { name: `${(Math.floor(turn) === turn) ? sword : shield} ${opponent.username}`, value: getField2(), inline: true },
        ]);

      if (lastMove.length > 0)
      {
        embed.setFooter({ text: lastMove });
      }

      editMsg.edit({ embeds: [embed] });
    }
  }

  // Sends empty embed, saves as editMsg for later editing
  await interaction.channel.send({ embeds: [new EmbedBuilder().setDescription("_ _")] }).then(embd =>
  {
    editMsg = embd;
  });

  var msg: Message;
  while (true)
  {
    if ((Math.floor(turn) === turn))
    {
      for (let i in player1)
      {
        player1[i].update();
        player2[i].update();
      }
    }

    doEditMsg(turn); // Update Gamestate
    if (checkWin().win) return; // Check for winner

    while (true) 
    {
      // Player 1's turn aka message.author.id
      await interaction.channel.awaitMessages({ filter: m => (m.author.id === interaction.user.id) || (m.author.id === opponent.id), max: 1, time: 200000 }).then(collected =>
      {
        // collects messages from either player so that either player can refresh or end
        msg = collected.first();
        if (msg.content.startsWith('attack') || msg.content.startsWith('swap')) collected.first().delete();
      }).catch((err) =>
      {
        interaction.channel.send('You timed out.');
        return;
      });

      if (typeof msg === 'undefined') return;
      let currentTurn = ((Math.floor(turn) === turn) ? interaction.user.id : opponent.id);
      if (msg.author.id === currentTurn && msg.content.startsWith('attack'))
      { // If it is player's turn and they attack
        let args = msg.content.split(' '); // NOTE: accidentally overrides function parameter "args"
        args.shift();
        if (parseInt(args[0]) > 0 && parseInt(args[0]) <= player1.length && parseInt(args[1]) > 0 && parseInt(args[1]) <= player1.length)
        {
          var attack = (Math.floor(turn) === turn) ? player1 : player2; //figure out which array to use
          var defend = (Math.floor(turn) === turn) ? player2 : player1; //figure out which array to use
          turn += 0.5;
          let player_character = attack[parseInt(args[0]) - 1];
          let opposing_character = defend[parseInt(args[1]) - 1];
          if (player_character.isDead) interaction.channel.send('That character is dead and can no longer be used.');
          else if (opposing_character.isDead) interaction.channel.send('That target is already dead. Why would you attack it again?');
          else
          {
            player_character.super_attack(opposing_character);
            lastMove = player_character.lastMove;
            break;
          }
        }
        else 
        {
          interaction.channel.send('Type `attack "1/2/3" "1/2/3"`');// message badly formatted
        }
      }
      else if (msg.author.id === currentTurn && msg.content.startsWith('swap'))
      {
        lastMove = "";
        var array = (Math.floor(turn) === turn) ? player1 : player2; //figure out which array to use
        turn += 0.5;
        let args = msg.content.split(' ');
        args.shift();
        for (var i in args)
        {
          if (parseInt(args[i]) > 0 && parseInt(args[i]) <= player1.length)
          {
            let swapping = array[parseInt(args[i]) - 1];
            if (swapping.isDead) interaction.channel.send('That character is dead and can no longer be used.');
            else
            {
              swapping.swap();
              lastMove += swapping.owner + "\'s " + swapping.type + " swapped it\'s ability to " + swapping.ability + "\n";
            }
          }
        }
        break;
      }
      else if (msg.content === 'end') 
      {
        interaction.channel.send('The Game Ended.'); // If either player says end, end the game.
        return;
      }
      else if (['r', 're', 'refresh', '!r', '!refresh', '!re'].includes(msg.content)) 
      {
        refresh(turn);// if either player1[0] or player1[1] refreshes
      }
      else if (msg.author.id === currentTurn) 
      {
        interaction.channel.send('Type `attack "1/2/3" "1/2/3"`'); // message badly formatted
      }
    }
  }
}

const builder = new SlashCommandBuilder()
  .setName('ambush')
  .setDescription('Text-based discord fighting game!')
  .addSubcommand(cmd => cmd
    .setName('challenge')
    .setDescription('challenge a friend to a duel!')
    .addUserOption(opt => opt
      .setName('target')
      .setDescription('friend who you would like to ambush')
      .setRequired(true)))
  .addSubcommand(cmd => cmd
    .setName('stats')
    .setDescription('get statistics about players who have played ambush'));

export default new ApplicationCommand(builder, run);