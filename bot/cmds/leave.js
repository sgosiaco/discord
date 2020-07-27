module.exports = {
    name: 'leave',
    aliases: [],
    description: 'Leave voice channel',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg, args) {
        if(msg.client.connection !== null) {
            msg.client.connection.disconnect();
            console.log(`Disconnected from ${msg.client.connection.channel.name}!`)
            msg.client.connection = null;
        }
    }
}