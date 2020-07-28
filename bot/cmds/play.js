const join = require('./join.js')
const ytdl = require('ytdl-core-discord')
const pattern = new RegExp('^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+');

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
        if (!pattern.test(args[0])) {
            return msg.reply('Please use a valid youtube link!');
        }

        if (msg.client.connection === null) {
            await join.execute(msg, args);
        }
        
        if (msg.client.dispatcher === null) {
            console.log(args[0]);
            msg.client.dispatcher = msg.client.connection.play(await ytdl(args[0]), { type: 'opus', volume: 0.1 }); //ytdl(args[0], { quality: 'highestaudio' })

            msg.client.dispatcher.on('start', () => {
                console.log('playing');
                msg.delete(); //catch error when deleting already delete message
                msg.channel.send(`Now playing: ${args[0]}`);
            });

            msg.client.dispatcher.on('finish', () => {
                console.log('finished');
                msg.client.dispatcher.destroy();
                msg.client.dispatcher = null;
                if (!msg.client.songs.isEmpty()) {
                    let song = [];
                    song.push(msg.client.songs.dequeue());
                    this.execute(msg, song);
                }
                //start auto leave timer?
            });

            msg.client.dispatcher.on('error',(error) => {
                console.error(error);
                msg.client.dispatcher.destroy();
                msg.client.dispatcher = null;
            });

            msg.client.dispatcher.on('debug', (error) => {
                console.error(error);
            });

        } else {
            //add song to queue
            msg.client.songs.enqueue(args[0])
            console.log(`Added to queue ${msg.client.songs.getLast()}`);
            msg.delete();
            msg.reply(`Added to queue: ${args[0]}`);
        }
    }
}