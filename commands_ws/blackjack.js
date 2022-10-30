const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const ids = require('../ids_manager');
const colors = require('../util/colors.js');

const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
const suits = ["diamonds", "hearts", "spades", "clubs"]

const ACE_FOOTER = {text: 'You\'ve drawn an ace!!\nSelect the value you\'d like to assign to your ace.'};
const END_FOOTER = { text: 'Game End' };
const HIT_STAY_FOOTER = {text: "Choose to draw another card (hit), or end your hand (stay)"};

var defaultEmbed;

const rulesEMBD = new EmbedBuilder()
    .setAuthor({name:'Wikipedia Reference [en.wikipedia.org/wiki/Blackjack]', url:'https://en.wikipedia.org/wiki/Blackjack'})
    .setTitle('Blackjack Rules')
    .setDescription("The most widely played casino banking game in the world, it uses decks of 52 cards and descends from a global family of casino banking games known as Twenty-One.Blackjack players do not compete against each other. The game is a comparing card game where each player competes against the dealer. ")
    .setColor(colors.purple)

const hitstayRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('bj_hit')
            .setLabel('Hit')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('bj_stay')    
            .setLabel("Stay")
            .setStyle(ButtonStyle.Danger),
    );

const aceDecisionRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('bj_11')    
            .setLabel("11")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('bj_1')    
            .setLabel("1")
            .setStyle(ButtonStyle.Primary),
    );

module.exports.data = new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('play blackjack!')
    .addBooleanOption(option => option
        .setName('private')
        .setDescription('Determines if your game is private (ephemeral)')
        .setRequired(false))
    .addBooleanOption(option => option
        .setName('help')
        .setDescription('Enter true if you want to know the rules of the game')
        .setRequired(false));

module.exports.execute = async interaction => {
    const p = interaction.options.getBoolean('private', false);
    var state = {
        dealercards: [],
        playercards: [],
        score: 0,
        end: false,
        ephemeral: (p? p : false),
    }
    
    if (interaction.options.getBoolean('help', false)) {
        return await interaction.reply({
            embeds: [rulesEMBD],
            ephemeral: state.ephemeral,
        });
    }
    
    defaultEmbed = new EmbedBuilder()
        .setTitle('Blackjack')
        .setColor(colors.green)
        .setAuthor({name:`${interaction.user.username}'s Game`})
        .setThumbnail('https://i.imgur.com/ibt3ETF.png');
    
    await interaction.reply({
        embeds: [defaultEmbed],
        ephemeral: state.ephemeral,
    });

    

    // Gets the player and dealer initial cards.
    state = drawDeal(state);

    for (var i = 0; i < 2; i++) {
        state = await drawCard(interaction, state);
        if (state.end) await doGameEnd(interaction, state); // If player draws ace and does not respond, we have to end the game.
    }
    
    doGameLoop(interaction, state)
}

async function doGameLoop(interaction, state) {
    while(true) {
        // Calculates player score every loop
        state.score = state.playercards.map(card => card.value).reduce((a,b) => a + b)

        console.log(state)
        state = await hitstay(interaction, state);

        // Finish condition (score greater than 21, or player said stay)
        if (state.score > 21 || state.end) {
            await doGameEnd(interaction, state);
            break;
        }
    }
}

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

async function doGameEnd(interaction, state) {
    await interaction.editReply({
        embeds: [defaultEmbed.setDescription(getDescription(state, interaction)).setFooter(END_FOOTER)],
        components: []
    });
}

// Get top and bottom emojis for input card
function getEmojis(card, interaction) {
    return [interaction.client.emojis.cache.get(ids[`_${card.card}${card.color}`]).toString(), interaction.client.emojis.cache.get(ids[`${card.suit}`]).toString()]
}

// Calculates random integer from begin to ending (inclusive)
function randInt(begin, ending) {
    return Math.floor(Math.random() * (ending - begin + 1)) + begin;
}

// Allows the player to either hit or stay
async function hitstay(interaction, state) {
    await interaction.editReply({
        embeds: [defaultEmbed.setDescription(getDescription(state, interaction)).setFooter(HIT_STAY_FOOTER)],
        components: [hitstayRow], // Add buttons
    });

    const interaction_filter = (i) => ((i.customId === 'bj_hit'|| i.customId == 'bj_stay') && i.user.id === interaction.user.id);

    return await interaction.channel.awaitMessageComponent({ interaction_filter, componentType: ComponentType.Button, time: 30000 })
        .then(async i =>{
            i.update({components: []}); // Remove buttons

            if (i.customId == 'bj_hit') {
                state = await drawCard(interaction, state);

                interaction.editReply({
                    embeds: [defaultEmbed.setDescription(getDescription(state, interaction))],
                    components: [hitstayRow],
                });
                return state;
            }

            state.end = true;
            interaction.editReply({
                embeds: [defaultEmbed.setDescription(getDescription(state, interaction))],
                components: [],
            });
            return state;

        }).catch(err => catchTimeOutError(interaction, state));
}

// Draws dealer's cards. (either 2 or 3 are drawn)
function drawDeal(state) {
    function drawSingleDealerCard() {
        let card = cards[randInt(0, 12)];
        let suit = suits[randInt(0, 3)];
        // Determines their values
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(card)) {
          value = parseInt(card);
        } else if (['Jack', 'Queen', 'King'].includes(card)) {
          value = 10;
        } else if (['Ace'].includes(card)) {
          value = 11;
        }
        state.dealercards.push(new Card(card, value, suit))
    }

    for (var i = 0; i < 2; i++) drawSingleDealerCard()
    if (state.dealercards[0].value + state.dealercards[1].value < 16) {
        drawSingleDealerCard()
    }
    return state
}

// Draws card for player. Used in beginning and in hitstay
async function drawCard(interaction, state) {
    let value = 0
    // Generates random card
    let card = cards[randInt(0, 12)];
    let suit = suits[randInt(0, 3)];

    if (['2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(card)) {
        value = parseInt(card);
    } else if (['Jack', 'Queen', 'King'].includes(card)) {
        value = 10;
    } else {
        value = await ace(interaction, state);
    }
    state.playercards.push(new Card(card, value, suit))

    await interaction.editReply({
        embeds: [defaultEmbed.setDescription(getDescription(state, interaction))],
        components: [],
    });
    return state
}

async function ace(interaction, state) {
    interaction.editReply({
        embeds:[defaultEmbed.setDescription(getDescription(state, interaction)).setFooter(ACE_FOOTER)],
        components: [aceDecisionRow]
    });

    const interaction_filter = (i) => ((i.customId === 'bj_11'|| i.customId == 'bj_1') && i.user.id === interaction.user.id);
    
    return await interaction.channel.awaitMessageComponent({ interaction_filter, componentType: ComponentType.Button, time: 30000 })
        .then(i =>{
            i.update({components: []});
            if (i.customId == 'bj_11') return 11;
            return 1;
        }).catch(err => { state = catchTimeOutError(interaction, state); return 0; });
}

// Get the description of the gamestate for the embed
function getDescription(state, interaction) {
    const dealercards = state.dealercards;
    const playercards = state.playercards;

    if (state.end === false) {
        return `Dealer's Cards:\n${topEmojis([dealercards[0]], interaction).join(' ')}\n${bottomEmojis([dealercards[0]], interaction).join(' ')}\n\nPlayer's Cards:\n${topEmojis(playercards, interaction).join(' ')}\n${bottomEmojis(playercards, interaction).join(' ')}`
    }

    let winner = '';
    const dscore = dealercards.map(card => card.value).reduce((a,b) => a + b)
    const pscore = playercards.map(card => card.value).reduce((a,b) => a + b)
    if (dscore === pscore) {
        winner = '**It\'s a tie!**';
    } else if ((dscore < pscore || dscore > 21) && pscore <= 21) {
        winner = '**You Win!**';
    } else winner = '**You lose!**';
    
    return `Dealer's Cards:\n${topEmojis(dealercards, interaction).join(' ')}\n${bottomEmojis(dealercards, interaction).join(' ')}\n\nPlayer's Cards:\n${topEmojis(playercards, interaction).join(' ')}\n${bottomEmojis(playercards, interaction).join(' ')}  \n\nDealer's score: **${dscore}**,\nYour score: **${pscore}**\n\n${winner}`
}

// Returns top half of the image for every card/suit combination
function topEmojis(cardlist, interaction) {
    return bottomlist = cardlist.map(card => getEmojis(card,interaction)[0]);
}

// Returns bottom half of the image for every card/suit combination
function bottomEmojis(cardlist, interaction) {
    return cardlist.map(card => getEmojis(card, interaction)[1]);
}

function catchTimeOutError(interaction, state) {
    interaction.followUp({content:'Game closed due to inactivity.', ephemeral: state.ephemeral});
    state.end = true;
    return state;
}