import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js"
import ServiceClient from "../../ServiceClient.js"
import ApplicationCommand from "../Infrastructure/ApplicationCommand.js";

async function execute(client: ServiceClient, interaction: ChatInputCommandInteraction)
{
    let user = interaction.options.getUser('user');
    interaction.reply({ content: `You secretly stabbed ${user.username} :)`, ephemeral: true });

    var online = interaction.guild.members.cache
        .filter(member => 
            !member.user.bot 
            && member.user.id != user.id 
            && member.user.id != interaction.user.id 
            && (member.presence.status === "online"))
            //&& member.roles.cache.has("768586902818258964")) // remove magic string
        .map(m => m.user.id)
    let letters = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬"]
    let suspects = []
    let add = interaction.channel.id == "812481897343090718" ? 6 : 4 // remove magic string
    for (var i = 0; i<add;i++){
        suspects.push(online.splice(Math.floor(Math.random() * online.length), 1))
    }
    suspects.splice(Math.floor(Math.random() * suspects.length), 0, interaction.user.id)
    let list = ""
    for (var suspect = 0; suspect < suspects.length; suspect++){
        list += letters[suspect] + " <@" + suspects[suspect] + ">\n"; 
    }

    const embed = new EmbedBuilder()
        .setTitle("" + user.displayName + "\'s body has been discovered!")
        .setDescription("*5 minutes remaining*\n\n " + list);
    
    let msg = await interaction.channel.send({ embeds: [embed] })

    // todo turn into buttons
    for (var reaction = 0; reaction < suspects.length; reaction++){
        msg.react(letters[reaction])
    }

    setTimeout(async function()
    {
        const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(interaction.user.id));
        try {
            for (const reaction of userReactions.values()) {
                await reaction.users.remove(interaction.user.id);
            }
        } catch (error) {
            console.error('Failed to remove reactions.');
        }
        let majority = 0
        let tie = false
        try {
            for (var reading = 1; reading < suspects.length; reading++){
                if (msg.reactions.cache.get(letters[reading]).count == msg.reactions.cache.get(letters[majority]).count) tie = true
                else if (msg.reactions.cache.get(letters[reading]).count > msg.reactions.cache.get(letters[majority]).count) {
                    majority = reading;
                    tie = false;
                }
            }
        } catch (err) {}
        //trying to make neater
        var results = new EmbedBuilder()
        if (tie) results.setDescription("Voting was skipped. (Tied)")
        else results.setDescription("<@" + suspects[majority] + "> was ejected.")
        if (interaction.user.id == suspects[majority] && !tie) results.addFields({ name: "\u200b", value: "0 Imposters Remaining" }).setColor("#22b822")
        else results.addFields({ name: "1 Imposter Remaining", value: "> <@"+interaction.user.id+"> has won!"}).setColor("#b82222")

        interaction.channel.send({embeds:[results]});
    }, 300_000)
}

const builder = new SlashCommandBuilder()
    .setName("stab")
    .setDescription("Stab a user, causing other users to attempt to deduce your identity")
    .addUserOption(opt =>opt
        .setName("user")
        .setDescription("The user to stab")
        .setRequired(true));

export default new ApplicationCommand(builder, execute);