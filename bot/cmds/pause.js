module.exports = {
    name: 'pause',
    aliases: [],
    description: 'Pause media',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg, args) {
        if(msg.client.dispatcher !== null) {
            msg.client.dispatcher.pause();
            console.log('Paused media')
        }
    }
}