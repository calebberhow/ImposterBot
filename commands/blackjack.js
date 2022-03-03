const Discord = require('discord.js');
const ids = require('../ids.json');
const colors = require('../util/colors.js');

// determine valid cards.
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
const suits = ["diamonds", "hearts", "spades", "clubs"]

module.exports.run = async (client, message, args) => {
  // Allows for all card info to be stored as one object
  class Card {
    constructor(_card, _value, _suit) {
      this.card = _card;
      this.value = _value;
      this.suit = _suit;
      if (["diamonds","hearts"].includes(this.suit)) {
        this.color = "R"
      } 
      else {
        this.color = "B"
      }
    }
  }
  
  // Get top and bottom emojis for input card
  function getEmojis(card) {
    return [client.emojis.cache.get(ids[`_${card.card}${card.color}`]).toString(), client.emojis.cache.get(ids[`${card.suit}`]).toString()]
  }

  // Calculates random integer from begin to ending (inclusive)
  function randInt(begin, ending) {
    return Math.floor(Math.random() * (ending - begin + 1)) + begin;
  }

  // Initialize variables
  var dealercards = [], playercards = [], score;
  var defaultEmbed, blackjackMessage;
  var end = false;

  // Creating default embed
  defaultEmbed = new Discord.MessageEmbed()
    .setTitle('Blackjack')
    .setFooter('type hit or stay')
    .setColor(colors.green)
    .setAuthor(`${message.author.username}'s Game`)
    .setThumbnail('https://i.imgur.com/ibt3ETF.png');

  // Sends embed, saves as bjEmbed for later editing
  await message.channel.send(defaultEmbed).then(embd => {
    blackjackMessage = embd;
  });

  // Gets the player and dealer initial cards.
  drawDeal();
  await drawCard(message);
  await drawCard(message);

  // Game loop
  while(true) {
    await hitstay(message);

    // Calculates player score every loop
    score = 0;
    for (var i = 0; i < playercards.length; i++) {
      score += playercards[i].value;
    }
    // Finish condition (score greater than 21, or player said stay)
    if (score > 21 || end) {
      blackjackMessage.edit(defaultEmbed.setDescription(getDescription(true)).setFooter('Game End'));
      break;
    }
  }

  // Redundant final edit to prevent silliness
  blackjackMessage.edit(defaultEmbed.setDescription(getDescription(true)).setFooter('Game End'));

  // Allows the player to either hit or stay
  async function hitstay(message) {
    // Inform user what to do
    blackjackMessage.edit(defaultEmbed.setDescription(getDescription(end)).setFooter('type hit or stay'));

    // Await response from user
    var msg;
    await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 75000 }).then(collected => {
      msg = collected.first().content;
    }).catch((err) => {
      message.channel.send('Game closed due to inactivity.');
      end = true;
    });

    if (msg === 'hit') {
      await drawCard(message);
      end = false;
      blackjackMessage.edit(defaultEmbed.setDescription(getDescription(end)).setFooter('type hit or stay'));
    }
    else if (msg == 'stay') {
      end = true;
      blackjackMessage.edit(defaultEmbed.setDescription(getDescription(end)).setFooter('Game End'));
    }
  }

  // Draws dealer's cards. (either 2 or 3 are drawn)
  function drawDeal() {
    // Draws 2 random cards
    for (var i = 0; i < 2; i++) {
      card = cards[randInt(0, 12)];
      suit = suits[randInt(0, 3)];
      // Determines their values
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(card)) {
        value = parseInt(card);
      } else if (['Jack', 'Queen', 'King'].includes(card)) {
        value = 10;
      } else if (['Ace'].includes(card)) {
        value = 11;
      }
      // Add card to list
      dealercards.push(new Card(card, value, suit))
    }
    // If dealer's score is too low, it will draw a third card
    if (dealercards[0].value + dealercards[1].value < 16) {
      card = cards[randInt(0, 12)];
      suit = suits[randInt(0, 3)];
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(card)) {
        value = parseInt(card);
      } else if (['Jack', 'Queen', 'King'].includes(card)) {
        value = 10;
      } else if (['Ace'].includes(card)) {
        value = 11;
      }
      // Add card to list
      dealercards.push(new Card(card, value, suit))
    }
  }

  // Draws card for player. Used in beginning and in hitstay
  async function drawCard(message) {
    let value = 0, card = '', msg = '';
    // Generates random card
    card = cards[randInt(0, 12)];
    suit = suits[randInt(0, 3)];

    // Determines its value
    if (['2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(card)) {
      value = parseInt(card);
    } else if (['Jack', 'Queen', 'King'].includes(card)) {
      value = 10;
      // If ace, let the player decide whether 1 or 11
    } else {
      // Inform user
      blackjackMessage.edit(defaultEmbed.setDescription(getDescription(end)).setFooter('type 11 or 1 to determine ace\'s value'));
      // Loops the awaitMessages until message is 11 or 1.
      while (msg !== '11' && msg !== '1') {
        await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 75000 }).then(collected => {
          msg = collected.first().content;
          // If the message is not 11 or 1, notify user, then continue loop
          if (msg !== '11' && msg !== '1') {
            message.reply('Send `11` or `1` please.')
          }
        }).catch((err) => {
          message.channel.send('Something went wrong')
        })
      }
      // Assign value based on message receieved by user (11 or 1)
      (msg === '11') ? value = 11 : value = 1;
    }
    // Add card to list
    playercards.push(new Card(card, value, suit))
  }

  // Get the description of the gamestate for the embed
  function getDescription(ending) {
    // If it is the end of the game, tally scores, and show who won
    if (ending === true) {
      let dscore = 0, pscore = 0, winner = '';
      for (var j = 0; j < dealercards.length; j++) {
        dscore += dealercards[j].value;
      }
      for (var i = 0; i < playercards.length; i++) {
        pscore += playercards[i].value;
      }
      // Determining winner of game
      if (dscore === pscore) {
        winner = '**It\'s a tie!**';
      } else if ((dscore < pscore || dscore > 21) && pscore <= 21) {
        winner = '**You Win!**';
      } else winner = '**You lose!**';
      // Show end of game summary (all cards,  player/dealer score, winner)
      return `Dealer's Cards:\n${topEmojis(dealercards).join(' ')}\n${bottomEmojis(dealercards).join(' ')}\n\nPlayer's Cards:\n${topEmojis(playercards).join(' ')}\n${bottomEmojis(playercards).join(' ')}  \n\nDealer's score: **${dscore}**,\nYour score: **${pscore}**\n\n${winner}`
      // Otherwise, Show player's status and the dealer's first card.
    } else {
      return `Dealer's Cards:\n${topEmojis([dealercards[0]]).join(' ')}\n${bottomEmojis([dealercards[0]]).join(' ')}\n\nPlayer's Cards:\n${topEmojis(playercards).join(' ')}\n${bottomEmojis(playercards).join(' ')}`
    }
  }

  // Returns top half of the image for every card/suit combination
  function topEmojis(cardlist) {
    let toplist = [];
    cardlist.forEach((card) => {
      toplist.push(getEmojis(card)[0])
    });
    return toplist;
  }

  // Returns bottom half of the image for every card/suit combination
  function bottomEmojis(cardlist) {
    let bottomlist = [];
    cardlist.forEach(card => {
      bottomlist.push(getEmojis(card)[1])
    });
    return bottomlist;
  }
}

module.exports.config = {
  name: 'blackjack',
  aliases: ['bj']
};