module.exports = {
    name: 'server',
    aliases: ['si'],
    description: 'Server info',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg, args) {
        msg.channel.send(`This server's name is ${msg.guild.name}\nTotal members: ${msg.guild.memberCount}`);
    }
};