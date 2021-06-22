import { Message } from 'discord.js';
import Settings from '../../settings';

module.exports = {
    name: 'timeout',
    aliases: [],
    description: 'Change timeout',
    usage: '[0-5000]',
    cooldown: 5,
    args: true,
    guildOnly: true,
    execute(msg: Message, args: Array<string>) {
        const settings = Settings.getInstance()
        const time = parseInt(args[0]);
        if ( time >= 0 && time <= 5000) {
          settings.timeoutTime = time;
        } else {
          return;
        }
        if (settings.dispatcher !== null) {
          clearTimeout(settings.timeout);
          settings.timeout = setTimeout(() => {
            const settings = Settings.getInstance()
            if (settings.connection !== null) {
            settings.connection.disconnect();
            console.log(`Disconnected from ${settings.connection.channel.name}!`);
            settings.connection = null;
            settings.playerMessage = null;
          }}, time);
          console.log(`Set timeout to ${time}ms`);
        }
        msg.reply(`Set timeout to ${time}ms`);
    }
}