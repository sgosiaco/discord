module.exports = {
    name: 'purge',
    aliases: [],
    description: '',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    execute(msg, args) {
        msg.client.always = !msg.client.always;
        msg.reply(`The purge is now ${msg.client.always ? 'active' : 'disabled'}`);
    }
}