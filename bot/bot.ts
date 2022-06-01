import { Client, Collection, MessageFlags, TextChannel } from 'discord.js';
import { prefix, token, defaultCooldown } from './config.json';
import Settings from './settings';

const client = new Client();
const settings = Settings.getInstance();
settings.init('./cmds');
const cooldowns: Collection<string, Collection<string, number>> = new Collection();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (settings.always && !msg.author.bot && !msg.content.startsWith(prefix) && !msg.mentions.has(client.user) && msg.channel.type === 'text') {
        let words = msg.content.trim().split(/ +/).map(word => word.toLowerCase());
        let keyword = null;

        const cmd = settings.alwaysCMDS.find(item => {
            keyword = item.always.filter(word => {
                // if exact check only whole words
                if (item.exact) {
                    return words.includes(word)
                }
                // otherwise check for partial string match
                for (const w of words) {
                    if (w.includes(word)) {
                        return word
                    }
                }
            }).shift()
            return keyword !== undefined;
        });
        if (!cmd) return;
        return cmd.execute(msg, words, keyword);
    }
    if ((!msg.content.startsWith(prefix) || msg.author.bot) && !msg.mentions.has(client.user)) return;

    const at = `<@!${client.user.id}>`
    let args = msg.content.slice(prefix.length).trim().split(/ +/);
    if (msg.mentions.has(client.user)) {
        msg.mentions.users.delete(client.user.id);
        let temp = msg.content.replace(at, '').trim();
        args = temp.startsWith(prefix) ? temp.slice(prefix.length).trim().split(/ +/) : temp.trim().split(/ +/);
    }
    const cmdName = args.shift().toLowerCase();

    const cmd = settings.cmds.get(cmdName) || settings.cmds.find(item => item.aliases && item.aliases.includes(cmdName));

    if (!cmd) return;

    if (cmd.guildOnly && msg.channel.type !== 'text') {
        return msg.reply('I can\'t execute that command inside DMs!');
    }

    if (cmd.args && !args.length) {
        let reply = 'You didn\'t provide any arguments!';

        if (cmd.usage) {
            reply += `\nThe proper usage is: \`${prefix}${cmd.name} ${cmd.usage}\``;
        }
        return msg.reply(reply);
    }

    if (!cooldowns.has(cmd.name)) {
        cooldowns.set(cmd.name, new Collection());
    }

    const now = Date.now();
    const timestamp = cooldowns.get(cmd.name);
    const cooldownTime = (cmd.cooldown || defaultCooldown) * 1000;

    if (timestamp.has(msg.author.id)) {
        const expireTime = timestamp.get(msg.author.id) + cooldownTime;

        if (now < expireTime) {
            const timeLeft = (expireTime - now) / 1000;
            return msg.reply(`Please wait ${timeLeft.toFixed(1)} more second${timeLeft > 1 ? 's' : ''} before reusing the \`${cmd.name}\` command.`);
        }
    }

    timestamp.set(msg.author.id, now);
    setTimeout(() => timestamp.delete(msg.author.id), cooldownTime);

    try {
        cmd.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('Error occured!');
    }
});

client.on('voiceStateUpdate', (oldUser, newUser) => {
    const log = oldUser.member.guild.channels.cache.find(ch => ch.name === 'time');
    const time = (Date.now() / 1000) >> 0;
    if (oldUser.channelID != null && newUser.channelID === null) {
        (log as TextChannel).send(`${oldUser.member} has left ${oldUser.channel.name} at <t:${time}:R>`);
    } else if (oldUser.channelID === null && newUser.channelID != null) {
        (log as TextChannel).send(`${newUser.member} has joined ${newUser.channel.name} at <t:${time}:R>`);
    }
});

client.login(token);