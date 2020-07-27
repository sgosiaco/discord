const join = require('./join.js')
const ytdl = require('ytdl-core-discord')
module.exports = {
    name: 'play',
    aliases: [],
    description: 'Play media, autojoins vc if not already in channel',
    usage: '',
    cooldown: 5,
    args: true,
    guildOnly: true,
    async execute(msg, args) {
        if (msg.client.connection === null) {
            await join.execute(msg, args)
        }
        
        console.log(args[0])
        msg.client.dispatcher = msg.client.connection.play(await ytdl(args[0]), { type: 'opus', volume: 0.5 }); //ytdl(args[0], { quality: 'highestaudio' })

        msg.client.dispatcher.on('start', () => {
            console.log('playing');
            msg.channel.send(`Now playing: ${args[0]}`)
        });

        msg.client.dispatcher.on('finish', () => {
            console.log('finished');
        });

        msg.client.dispatcher.on('error', console.error);
    }
}