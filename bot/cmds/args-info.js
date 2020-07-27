module.exports = {
	name: 'args-info',
	aliases: ['ai'],
	description: 'Information about the arguments provided.',
    usage: '<> <> <> ...',
	cooldown: 5,
    args: true,
    guildOnly: true,
	execute(msg, args) {
		if (args[0] === 'foo') {
			return msg.channel.send('bar');
		}

		msg.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};