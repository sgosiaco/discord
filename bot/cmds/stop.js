module.exports = {
    name: 'stop',
    aliases: [],
    description: 'Stop media',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg, args) {
        if(msg.client.dispatcher !== null) {
            msg.client.dispatcher.destroy();
            console.log('Stopped media')
            msg.client.dispatcher = null;
        }
    }
}