const Discord = require('discord.js');
module.exports = {
    name: 'autoplay',
    aliases: ['auto'],
    description: 'Autoplay media',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg, args) {
        if (msg.client.dispatcher !== null) {
            msg.client.autoplay = !msg.client.autoplay;
            msg.delete()
            const embed = new Discord.MessageEmbed(msg.client.playerMessage.embeds[0]).setFooter(`Autoplay: ${msg.client.autoplay ? 'on' : 'off'} | Queue ${msg.client.songs.getSize()}`)
            msg.client.playerMessage.edit(embed);
        }
    }
}