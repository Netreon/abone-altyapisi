const Discord = require("discord.js")
const client = new Discord.Client({ intents: [Object.values(Discord.GatewayIntentBits)] })
const config = require("./config.json")

const scanner = require("ocr-space-api")
var options =  { 
  apikey: config.api,
  language: 'eng', // Português
  imageFormat: 'image/png', // Image Type (Only png ou gif is acceptable at the moment i wrote this)
  isOverlayRequired: true
};

client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    const uye = message.guild.members.cache.get(message.author.id)
    if (message.channel.id == config.abonekanal) {
        if (uye.roles.cache.has(config.abonerol)) return message.delete()
        if (message.attachments.size > 0 || message.embeds.length > 0) {
            const imageUrls = [];
      
            if (message.attachments.size > 0) {
              message.attachments.forEach((attachment) => {
                if (attachment.url) {
                  imageUrls.push(attachment.url);
                }
              });
            }
      
            if (message.embeds.length > 0) {
              message.embeds.forEach((embed) => {
                if (embed.type === 'image' && embed.url) {
                  imageUrls.push(embed.url);
                }
              });
            }
                                const loadembed = new Discord.EmbedBuilder()
                    .setTitle("Lütfen bekle!")
                    .setDescription("Otomatik olarak abone olup olmadığını kontrol ediyorum, " + message.author.toString() + "!")
            
            message.reply({ embeds: [loadembed] })
            	.then((msg) => {
                scanner.parseImageFromUrl(imageUrls[0], options)
              .then(function (parsedResult) {
                const readed = parsedResult.parsedText.toLowerCase();
                if (readed.includes("abone olundu") && readed.includes(config.kanal) || readed.includes("olmdu") && readed.includes(config.kanal) || readed.includes("subscribed") && readed.includes(config.kanal)) {
                    const basariliembed = new Discord.EmbedBuilder()
                    .setTitle("Başarılı!")
                    .setDescription("Abone rolün verildi, " + message.author.toString() + "!")
                    const member = message.guild.members.cache.get(message.author.id)
                    member.roles.add(config.abonerol)
                    msg.edit({ embeds: [basariliembed] })
                } else {
                                        const basarisiz = new Discord.EmbedBuilder()
                    .setTitle("Başarısız!")
                    .setDescription("Otomatik olarak kontrol edemedim, " + message.author.toString() + "! Kısa süre içerisinde yetkililer buraya bakacaklardır. Lütfen kanala abone olup olmadığını kontrol edip tekrar dene.")
					msg.edit({ embeds: [basarisiz] })
                }
              }).catch(function (err) {
                console.log('ERROR:', err);
              });
            })
        }
    }
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.login(config.token)