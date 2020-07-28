const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, defaultCooldown } = require('./config.json')
const client = new Discord.Client();
client.cmds = new Discord.Collection();
client.connection = null;
client.dispatcher = null;

const cmdFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
for (const file of cmdFiles) {
    const cmd = require(`./cmds/${file}`);
    client.cmds.set(cmd.name, cmd);
}

const cooldowns = new Discord.Collection();
const Queue = require('./queue.js')
client.songs = new Queue(100);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if ( (!msg.content.startsWith(prefix) || msg.author.bot) && !msg.mentions.has(client.user)) return;

    const at = `<@!${client.user.id}>`
    var args = msg.content.slice(prefix.length).trim().split(/ +/);
    if (msg.mentions.has(client.user)) {
        msg.mentions.users.delete(client.user);
        var temp = msg.content.replace(at, '').trim();
        args = temp.startsWith(prefix) ? temp.slice(prefix.length).trim().split(/ +/) : temp.trim().split(/ +/);
    }
    const cmdName = args.shift().toLowerCase();

    const cmd = client.cmds.get(cmdName) || client.cmds.find(item => item.aliases && item.aliases.includes(cmdName));

    if (!cmd) return;
    
    if(cmd.guildOnly && msg.channel.type !== 'text') {
        return msg.reply('I can\'t execute that command inside DMs!');
    }

    if(cmd.args && !args.length) {
        let reply = 'You didn\'t provide any arguments!'

        if(cmd.usage) {
            reply += `\nThe proper usage is: \`${prefix}${cmd.name} ${cmd.usage}\``;
        }
        return msg.reply(reply)
    }

    if(!cooldowns.has(cmd.name)) {
        cooldowns.set(cmd.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamp = cooldowns.get(cmd.name);
    const cooldownTime = (cmd.cooldown || defaultCooldown) * 1000;

    if(timestamp.has(msg.author.id)) {
        const expireTime = timestamp.get(msg.author.id) + cooldownTime;

        if (now < expireTime) {
            const timeLeft = (expireTime - now) / 1000;
            return msg.reply(`Please wait ${timeLeft.toFixed(1)} more second${timeLeft > 1 ? 's' : ''} before reusing the \`${cmd.name}\` command.`)
        }
    }

    timestamp.set(msg.author.id, now);
    setTimeout(() => timestamp.delete(msg.author.id), cooldownTime);

    try {
        cmd.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('Error occured!')
    }
});

client.login(token);