const Discord = require("discord.js");
const Canvas = require('canvas');
const utils = require('../../utils.js');

module.exports = {
    name: 'rank',
    aliases: [],
    description: '',
    usage: '',
    cooldown: 5,
    args: false,
    always: ['general', 'lieutenant', 'colonel', 'admiral', 'captian', 'major'],
    guildOnly: true,
    async execute(msg, words, word) {
        var idx = words.indexOf(word);
        if (words[idx + 1] === undefined) return;
        const text = `${utils.capitalize(word)} ${utils.capitalize(words[idx + 1])}`;
        const canvas = Canvas.createCanvas(300, 300);
        const ctx = canvas.getContext('2d');
        const bg = await Canvas.loadImage('https://static-cdn.jtvnw.net/jtv_user_pictures/kkomrade-profile_image-af4f674dbc67fcd4-300x300.png');
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        ctx.font = '30px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        const width = ctx.measureText(text).width / 2;
        ctx.strokeText(text, 180 - width, 40);
        ctx.fillText(text, 180 - width, 40);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'salute.png');
        attachment.width = 300;
        attachment.height = 300;
        msg.channel.send(text, attachment);
    }
}