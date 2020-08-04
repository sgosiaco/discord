import { Message } from 'discord.js';
import { get } from 'http'; 

module.exports = {
    name: 'super',
    aliases: [],
    description: '',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    async execute(msg: Message, args: Array<string>) {
        get('http://graphics.slmn.io/super/tf.php', res => {
            let data = ''
            res.on('data', d => {
                data += d
            })
            res.on('end', () => {
                msg.channel.send(data)
            })
        })
    }
}