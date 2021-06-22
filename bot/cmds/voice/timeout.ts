import { Message } from 'discord.js';
import Settings from '../../settings';

module.exports = {
    name: 'timeout',
    aliases: [],
    description: 'Change timeout',
    usage: '[0-10]minutes',
    cooldown: 5,
    args: true,
    guildOnly: true,
    execute(msg: Message, args: Array<string>) {
        const settings = Settings.getInstance()
        const time = parseInt(args[0]);
        if ( time >= 0 && time <= 10) {
          settings.timeoutTime = time*60000;
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
          console.log(`Set timeout to ${time} minutes`);
        }
        msg.reply(`Set timeout to ${time} minutes`);
    }
}