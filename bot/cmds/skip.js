const play = require('./play.js')

module.exports = {
    name: 'skip',
    aliases: [],
    description: 'Skip media',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg, args) {
        if (msg.client.dispatcher !== null) {
            msg.client.dispatcher.destroy();
            msg.client.dispatcher = null;
            if (!msg.client.songs.isEmpty()) {
                let song = [];
                song.push(msg.client.songs.dequeue());
                play.execute(msg, song);
            }
        }
    }
}