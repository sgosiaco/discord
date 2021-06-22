import { MessageEmbed, Message } from 'discord.js';
import Settings from '../../settings';

module.exports = {
    name: 'volume',
    aliases: [],
    description: 'Change volume',
    usage: '[0-100]',
    cooldown: 5,
    args: true,
    guildOnly: true,
    execute(msg: Message, args: Array<string>) {
        const settings = Settings.getInstance()
        if (settings.dispatcher !== null) {
            const vol = parseInt(args[0]);
            if( vol >= 0 && vol <= 100) {
                settings.dispatcher.setVolume(vol/100);
                console.log(`Set volume to ${vol/100}`);
            }
            const embed = new MessageEmbed(settings.playerMessage.embeds[0]).setFooter(`Autoplay: ${settings.autoplay ? 'on' : 'off'} | Queue ${settings.songs.getSize()} | Volume ${settings.dispatcher.volume*100}%`)
            settings.playerMessage.edit({ embed : embed});
        }
    }
}