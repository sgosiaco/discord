module.exports = {
    name: 'volume',
    aliases: [],
    description: 'Change volume',
    usage: '[0-100]',
    cooldown: 5,
    args: true,
    guildOnly: true,
    execute (msg, args) {
        if (msg.client.dispatcher !== null) {
            const vol = parseInt(args[0]);
            if( vol >= 0 && vol <= 100) {
                msg.client.dispatcher.setVolume(vol/100);
                console.log(`Set volume to ${vol/100}`);
            }
        }
    }
}