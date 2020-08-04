import {  Message, MessageEmbed } from 'discord.js';
import Settings from '../../settings';

module.exports = {
    name: 'autoplay',
    aliases: ['auto'],
    description: 'Autoplay media',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg: Message, args: Array<string>) {
        const settings = Settings.getInstance()
        if (settings.dispatcher !== null) {
            settings.autoplay = !settings.autoplay;
            msg.delete()
            const embed = new MessageEmbed(settings.playerMessage.embeds[0]).setFooter(`Autoplay: ${settings.autoplay ? 'on' : 'off'} | Queue ${settings.songs.getSize()}`)
            settings.playerMessage.edit(embed);
        }
    }
}