const Discord = require("discord.js");
const Canvas = require('canvas');
const utils = require('../../utils.js');

module.exports = {
    name: 'our',
    aliases: [],
    description: '',
    usage: '',
    cooldown: 5,
    args: false,
    always: ['our'],
    guildOnly: true,
    async execute(msg, words, word) {
        var idx = words.indexOf(word);
        if (words[idx + 1] === undefined) return;
        const text = `${utils.capitalize(word)} ${utils.capitalize(words[idx + 1])}`;
        const canvas = Canvas.createCanvas(300, 196);
        const ctx = canvas.getContext('2d');
        const bg = await Canvas.loadImage('https://en.meming.world/images/en/thumb/a/a9/Communist_Bugs_Bunny.jpg/300px-Communist_Bugs_Bunny.jpg');
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        ctx.font = '30px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        const width = ctx.measureText(text).width / 2;
        ctx.strokeText(text, 180 - width, canvas.height/2 + 60);
        ctx.fillText(text, 180 - width, canvas.height/2 + 60);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'salute.png');
        attachment.width = 300;
        attachment.height = 196;
        msg.channel.send(text, attachment);
    }
}