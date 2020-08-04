import { Message } from 'discord.js';
import Settings from '../../settings';

module.exports = {
    name: 'leave',
    aliases: [],
    description: 'Leave voice channel',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg: Message, args: Array<string>) {
        const settings = Settings.getInstance()
        if (settings.connection !== null) {
            settings.connection.disconnect();
            console.log(`Disconnected from ${settings.connection.channel.name}!`);
            settings.connection = null;
            settings.playerMessage = null;
        }
    }
}