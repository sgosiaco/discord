import { Message } from 'discord.js';
import Settings from '../settings';

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    execute(msg: Message, args: Array<string>) {
        if (!args.length) return msg.reply('You didn\'t pass a command to reload!');
        const cmdName = args[0].toLowerCase();
        const settings = Settings.getInstance()
        const cmd = settings.cmds.get(cmdName) || settings.cmds.find(item => item.aliases && item.aliases.includes(cmdName));

        if (!cmd) return msg.reply(`There is no command with name or alias \`${cmdName}\``);

        delete require.cache[require.resolve(`./${cmd.name}.js`)];

        try {
            const newCmd = require(`./${cmd.name}.js`);
            settings.cmds.set(newCmd.name, newCmd);
            msg.reply(`Reloaded \`${cmd.name}\`!`);
        } catch (error) {
            console.log(error);
            msg.reply(`There was an error while reloading the command \`${cmd.name}\`\n\`${error.message}\``);
        }
    }
}