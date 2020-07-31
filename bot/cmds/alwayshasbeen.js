const Discord = require("discord.js");
const Canvas = require('canvas');
const fs = require('fs');

module.exports = {
    name: 'alwayshasbeen',
    aliases: ['always'],
    description: 'Dynamically generates always has been meme.',
    usage: '<Text goes here>',
    cooldown: 5,
    args: true,
    guildOnly: true,
    async execute(msg, args) {
        const canvas = Canvas.createCanvas(960, 540);
        const ctx = canvas.getContext('2d');
        const bg = await Canvas.loadImage("./cmds/alwayshasbeen.png"); //https://i.imgflip.com/46e43q.png
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Always has been', 580, 50);
        const text = args.join(' ');
        const width = (text.length * 25) / 2 //'Wait its all Ohio?'
        ctx.fillText(text, (canvas.width/2) - width, (canvas.height/2) - 50)

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'alwayshasbeen.png');
        msg.delete();
        msg.channel.send('Always has been', attachment);
    }
}