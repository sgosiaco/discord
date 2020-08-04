import { Message } from 'discord.js';
import Settings from '../../settings';

module.exports = {
    name: 'pause',
    aliases: [],
    description: 'Pause media',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg: Message, args: Array<string>) {
        const settings = Settings.getInstance()
        if (settings.dispatcher !== null) {
            settings.dispatcher.pause();
            console.log('Paused media');
        }
    }
}