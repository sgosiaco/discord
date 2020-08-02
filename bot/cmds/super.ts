import * as Discord from 'discord.js';
import { get } from 'http'; 

module.exports = {
    name: 'super',
    aliases: [],
    description: '',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg: Discord.Message, args: Array<string>) {
        get('http://graphics.slmn.io/super/tf.php', res => {
            let data = ''
            res.on('data', d => {
                data += d
            })
            res.on('end', () => {
                console.log(data)
                msg.channel.send(data)
            })
        })
    }
}