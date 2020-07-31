module.exports = {
    name: 'join',
    aliases: [],
    description: 'Join voice channel',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    async execute(msg, args) {
        if (msg.member.voice.channel) {
            msg.client.connection = await msg.member.voice.channel.join();
            /*
            msg.member.voice.channel.join()
                .then(connection => {
                    console.log(`Connected to ${connection.channel.name}!`)
                     msg.client.connection = connection
                })
                .catch(console.error);
            */
        }
    }
}