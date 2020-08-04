import { Message } from 'discord.js';
import Settings from '../settings';

module.exports = {
    name: 'purge',
    aliases: [],
    description: '',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg: Message, args: Array<string>) {
        const settings = Settings.getInstance()
        settings.always = !settings.always;
        msg.reply(`The purge is now ${settings.always ? 'active' : 'disabled'}`);
    }
}