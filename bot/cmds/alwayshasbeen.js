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
        const bg = await Canvas.loadImage('./cmds/alwayshasbeen.png'); //https://i.imgflip.com/46e43q.png
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#ffffff';
        const alwaysWidth = ctx.measureText('Always has been').width;
        ctx.fillText('Always has been', 960 - alwaysWidth - 10, 50);
        var link = null;
        if(args[args.length - 1].includes('http')) {
            link = args.pop();
        }
        const text = args.join(' ');
        const width = ctx.measureText(text).width / 2 //'Wait its all Ohio?'
        
        if (link !== null) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(275, 260, 185, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            const earth = await Canvas.loadImage(link);
            ctx.drawImage(earth, 85, 70, 380, 380);
            ctx.restore();
        }

        ctx.fillText(text, (canvas.width/2) - width, (canvas.height/2) - 50);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'alwayshasbeen.png');
        attachment.width = 960;
        attachment.height = 540;
        msg.delete();
        msg.channel.send('Always has been', attachment);
    }
}