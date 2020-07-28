const join = require('./join.js')
const ytdl = require('ytdl-core-discord')
module.exports = {
    name: 'play',
    aliases: ['add'],
    description: 'Play media, autojoins vc if not already in channel',
    usage: '',
    cooldown: 5,
    args: true,
    guildOnly: true,
    async execute(msg, args) {
        // add arg checking here before everything else

        if (msg.client.connection === null) {
            await join.execute(msg, args)
        }
        
        if (msg.client.dispatcher === null) {
            console.log(args[0])
            msg.client.dispatcher = msg.client.connection.play(await ytdl(args[0]), { type: 'opus', volume: 0.1 }); //ytdl(args[0], { quality: 'highestaudio' })

            msg.client.dispatcher.on('start', () => {
                console.log('playing');
                msg.channel.send(`Now playing: ${args[0]}`)
            });

            msg.client.dispatcher.on('finish', () => {
                console.log('finished');
                if (msg.client.songs.isEmpty()) {
                    msg.client.dispatcher = null
                } else {
                    msg.client.dispatcher = msg.client.connection.play(await ytdl(msg.client.songs.dequeue()), { type: 'opus', volume: 0.1 });
                }
                //start auto leave timer?
            });

            msg.client.dispatcher.on('error',(error) => {
                console.error(error)
                msg.client.dispatcher = null
            });

            msg.client.dispatcher.on('debug', (error) => {
                console.error(error)
            });
            
        } else {
            //add song to queue
            msg.client.songs.enqueue(args[0])
            console.log(`Added to queue ${msg.client.songs.getLast()}`)
        }
    }
}