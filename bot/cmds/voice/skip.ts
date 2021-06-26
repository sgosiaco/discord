import { Message } from 'discord.js';
import Settings from '../../settings';
import * as play from './play';
import Command from '../Command';

module.exports = {
    name: 'skip',
    aliases: [],
    description: 'Skip media',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg: Message, args: Array<string>) {
        const settings = Settings.getInstance()
        if (settings.dispatcher !== null) {
            settings.dispatcher.destroy();
            settings.dispatcher = null;
            if (!settings.songs.isEmpty()) {
                let song = [];
                song.push(settings.songs.dequeue());
                (play as Command).execute(msg, song);
            } else if (settings.autoplay && settings.autoplayNext !== null) {
                let song = [];
                song.push(settings.autoplayNext);
                console.log(`Autoplaying ${settings.autoplayNext}`);
                (play as Command).execute(msg, song);
            } else {
                settings.playerMessage.delete();
                settings.playerMessage = null;
                settings.timeout = setTimeout(() => {
                    const settings = Settings.getInstance()
                    if (settings.connection !== null) {
                        settings.connection.disconnect();
                        console.log(`Disconnected from ${settings.connection.channel.name}!`);
                        settings.connection = null;
                        settings.playerMessage = null;
                    }
                }, settings.timeoutTime);
            }
        }
    }
}