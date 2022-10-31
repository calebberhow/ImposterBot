const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const ids = require('../ids_manager');
const colors = require('../util/colors');
module.exports.data = new SlashCommandBuilder()
    .setName('stab')
    .setDescription('stab your friend (WIP)')
    .addUserOption(option => option
        .setName('user')
        .setDescription('friend you would like to stab')
        .setRequired(true));


//Need to pull users from Admin, Moderator, and Confirmed roles to use as suspects PREDOMINANTLY. Pull two users at RANDOM from the
//server, confirmed or not.

// Replies with ephemeral confirmation message.
// Then sends a seperate message in the chat (interaction.channel.send) with the stabbing/
// Add buttons (or context menus) for 


module.exports.execute = async (interaction) => {
    author = interaction.member;
    target = interaction.options.getUser('user');

    if (author.user === target) {
        return await interaction.reply({content: "Don't stab yourself...", ephemeral: true});
    }

    members = interaction.guild.members.cache;

    exclude_author_and_target = (member) => (member.user.id !== author.user.id) && (member.user.id !== target.id);

    // We want 2 totally random members EXCEPT not the target
    randomMembersArray = interaction.guild.members.cache.filter(exclude_author_and_target).random(2);

    // We don't want to select the two in randomMembersArray OR the author
    already_selected = new Set(randomMembersArray).add(author).add(interaction.guild.members.cache.find(user => user.id === target.id));

    remove_already_picked = (member) =>  !already_selected.has(member);
    filter_by_role = (member) => member.roles.cache.has(ids.confirmedRoleID);

    // If the cache is too small, there won't be anybody to pick from. This means we are not guaranteed to have enough options.
    randomMembers_confirmed = members.filter(remove_already_picked).filter(filter_by_role).random(1)
    
    // console.log(randomMembersArray.map(member => member.user.username).join(', '));
    // console.log(randomMembers_confirmed.map(member => member.user.username).join(', '));

    const suspects = shuffle([...randomMembersArray, ...randomMembers_confirmed, author])

    if(suspects.length < 4) {
        return await interaction.reply({content: "There are too few people here to play this game...", ephemeral: true});
    }

    const embd = new EmbedBuilder()
        .setTitle(`${target.username} has been stabbed!!`)
        .setDescription("Quick, vote out the imposter!")
        .setFooter({text: '(Only your first vote counts)'})
        .setImage(`attachment://venting_imposter.png`)
        .setColor(colors.purple);

    const suspectsOptionsRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('stab_option0')
                .setLabel(suspects[0].user.username)
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('stab_option1')    
                .setLabel(suspects[1].user.username)
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('stab_option2')
                .setLabel(suspects[2].user.username)
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('stab_option3')
                .setLabel(suspects[3].user.username)
                .setStyle(ButtonStyle.Danger),
        );
    
    await interaction.reply({content:"shh I won't tell", ephemeral:true})
    await interaction.channel.send({
        embeds: [embd],
        components: [suspectsOptionsRow],
        files: [{
            attachment: `./assets/stab/venting_imposter.png`,
            name: `venting_imposter.png`
        }]
    });

    const interaction_filter = (i) => (i.customId.match(/stab_/));
    const collector = interaction.channel.createMessageComponentCollector({ filter: interaction_filter, componentType: ComponentType.Button, time: 0.2*60*1000});
    
    collector.on('collect', i => {
        if (i.user.id === target.id) return i.reply({content: `You can't vote! You're a ghost.`, ephemeral:true})
        i.reply({content: `You voted for ${i.component.label}.`, ephemeral:true})
    });

    collector.on('end', collected => {
        console.log(collected);
        collected = collected.filter(i => i.user.id !== target.id)
        InteractionMap = new Map()
        for (i in collected) {
            if (InteractionMap.has(i.user.username)) continue
            InteractionMap.set(i.user.username, i.component.label)
        }
        console.log([...InteractionMap].map((username, vote) => `${username} voted against ${vote}`).join('\n'))
    });
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}
