import * as Discord from 'discord.js';
import Settings from '../../settings';

module.exports = {
    name: 'join',
    aliases: [],
    description: 'Join voice channel',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    async execute(msg: Discord.Message, args: Array<string>) {
        if (msg.member.voice.channel) {
            Settings.getInstance().connection = await msg.member.voice.channel.join();
        }
    }
}