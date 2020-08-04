import { Message } from 'discord.js';
import Settings from '../../settings';
import * as play from './play';

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
                play.execute(msg, song);
            } else if (settings.autoplay && settings.autoplayNext !== null) {
                let song = [];
                song.push(settings.autoplayNext);
                console.log(`Autoplaying ${settings.autoplayNext}`)
                play.execute(msg, song);
            } else {
                settings.playerMessage.delete();
                settings.playerMessage = null;
            }
        }
    }
}