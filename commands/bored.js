const lib = require('../util/lib.js');
const colors = require('../util/colors.js');

module.exports.run = async (client, message, args) => {
        let timer = Date.now()
        oxygen = message.channel   
        let code = []
        for (var i = Math.ceil(Math.random() * 3) + 5; i>0;i--){
            code.push(Math.floor(Math.random() * 10))
        }
        oxygen.send("Practice Code: `" + code.join("") + "`").then(async function () {
            await oxygen.awaitMessages(m => lettersToNum(m.content.toLowerCase()) == code.join(" "), { max: 1, time: 40000 }).then(collected => {
                    oxygen.send("Good Job <@" + collected.first().author.id + ">!\nTime: " + (Date.now() - timer + "ms")) 
            }).catch(err=>{ 
                oxygen.channel.send("> You didn't do it in time :(")
            });
        })
};

module.exports.config = {
  name: 'bored',
  aliases: ['bored']
};

function lettersToNum(phrase){
    return phrase.replace(/[0-9]+/g, "fail").replace(/\zero\b/gi, '0').replace(/\bone\b/gi, '1').replace(/\btwo\b/gi, '2').replace(/\bthree\b/gi, '3').replace(/\bfour\b/gi, '4').replace(/\bfive\b/gi, '5').replace(/\bsix\b/gi, '6').replace(/\bseven\b/gi, '7').replace(/\beight\b/gi, '8').replace(/\bnine\b/gi, '9');;
}