import { Message, MessageAttachment } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';

module.exports = {
    name: 'alwayspfp',
    aliases: [],
    description: '',
    usage: '<Text goes here> <@mention>',
    cooldown: 5,
    args: true,
    guildOnly: true,
    async execute(msg: Message, args: Array<string>) {
        if(msg.mentions.users.size !== 1) return msg.reply('Need to tag someone!');
        const canvas = createCanvas(960, 540);
        const ctx = canvas.getContext('2d');
        const bg = await loadImage('./cmds/alwayshasbeen.png'); //https://i.imgflip.com/46e43q.png
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        const alwaysWidth = ctx.measureText('Always has been').width;
        ctx.strokeText('Always has been', 960 - alwaysWidth - 10, 50);
        ctx.fillText('Always has been', 960 - alwaysWidth - 10, 50);
        let link = msg.mentions.users.first().displayAvatarURL({ format: 'png', dynamic: false });
        const text = args.filter(item => !item.includes('<@')).join(' ');
        const width = ctx.measureText(text).width / 2 //'Wait its all Ohio?'
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(275, 260, 185, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const earth = await loadImage(link);
        ctx.drawImage(earth, 85, 70, 380, 380);
        ctx.restore();
        const fg = await loadImage('./cmds/alwayshasbeenOver.png');
        ctx.drawImage(fg, 0, 0, canvas.width, canvas.height);

        ctx.strokeText(text, (canvas.width/2) - width, (canvas.height/2) - 50);
        ctx.fillText(text, (canvas.width/2) - width, (canvas.height/2) - 50);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'alwayshasbeen.png');
        attachment.width = 960;
        attachment.height = 540;
        msg.delete();
        msg.channel.send('Always has been', attachment);
    }
}