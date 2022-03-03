const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    online = message.guild.members.cache.filter(member => !member.user.bot && member.user.id != message.mentions.members.first().id && member.user.id != message.author.id && (member.presence.status === "online" || member.presence.status == "dnd") && member.roles.cache.has("768586902818258964")).map(m => m.user.id)
        let letters = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬"]
        let suspects = []
        let add = message.channel.id == "812481897343090718" ? 6 : 4
        //console.log(message.channel.id == "812481897343090718")
        for (var i = 0; i<add;i++){
            suspects.push(online.splice(Math.floor(Math.random() * online.length), 1))
        }
        // console.log(suspects)
        suspects.splice(Math.floor(Math.random() * suspects.length), 0, message.author.id)
        message.delete()
        list = ""
        for (var suspect = 0; suspect < suspects.length; suspect++){
            list += letters[suspect] + " <@" + suspects[suspect] + ">\n"; 
        }
        message.channel.send(new Discord.MessageEmbed().setTitle("" + message.mentions.members.first().displayName + "\'s body has been discovered!").setDescription("*5 minutes remaining*\n\n " + list)).then(msg => {
            for (var reaction = 0; reaction < suspects.length; reaction++){
                msg.react(letters[reaction])
            }
            setTimeout(async function(){
               // console.log(msg.reactions)
                const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                try {
                    for (const reaction of userReactions.values()) {
                        await reaction.users.remove(message.author.id);
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
               var results = new Discord.MessageEmbed()
                if (tie) results.setDescription("Voting was skipped. (Tied)")
                else results.setDescription("<@" + suspects[majority] + "> was ejected.")
                if (message.author.id == suspects[majority] && !tie) results.addField("\u200b","0 Imposters Remaining").setColor("22b822")
                else results.addField("1 Imposter Remaining","> <@"+message.author.id+"> has won!").setColor("b82222")
                message.channel.send(results)
            }, 300000)
            
        })
}

module.exports.config = {
  name: 'stab',
  aliases: []
};