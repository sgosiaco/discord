import { Message } from 'discord.js';
import Settings from '../../settings';

module.exports = {
    name: 'stop',
    aliases: [],
    description: 'Stop media',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg: Message, args: Array<string>) {
        let settings = Settings.getInstance()
        if (settings.dispatcher !== null) {
            settings.dispatcher.destroy();
            console.log('Stopped media');
            settings.dispatcher = null;
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