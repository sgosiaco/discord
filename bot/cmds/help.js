const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    aliases: ['commands'],
	description: 'List all of my commands or info about a specific command.',
	usage: '[command name]',
    cooldown: 5,
    guildOnly: false,
	execute(msg, args) {
        const data = [];
        const { cmds } = msg.client;

        if (!args.length) {
            data.push('Here is a list of all my commands:');
            data.push(cmds.map(cmd => cmd.name).join(','));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            
            return msg.author.send(data, { split: true })
                .then(() => {
                    if(msg.channel.type === 'dm') return;
                    msg.reply('I\'ve set you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
                    msg.reply('It seems like I can\'t DM you! Do you have DMs disabled?');
                })
        }

        const cmdName = args[0].toLowerCase();
        const cmd  = cmds.get(cmdName) || cmds.find(item => item.aliases && item.aliases.includes(name));

        if (!cmd) {
            return msg.reply('That\'s not a valid command!');
        }

        data.push(`**Name:** ${cmd.name}`);

        if (cmd.aliases) data.push(`**Aliases:** ${cmd.aliases.join(',')}`);
        if (cmd.description) data.push(`**Description:** ${cmd.description}`);
        if (cmd.usage) data.push(`**Usage:** ${cmd.usage}`);
        data.push(`**Cooldown:** ${cmd.cooldown || 3} second${(cmd.cooldown || 3) > 1 ? 's' : ''} `);
        msg.channel.send(data, { split: true })
	},
};