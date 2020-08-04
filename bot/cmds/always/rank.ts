import { Message, MessageAttachment }from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import { capitalize } from '../../utils';

module.exports = {
    name: 'rank',
    aliases: [],
    description: '',
    usage: '',
    cooldown: 5,
    args: false,
    always: ['general', 'lieutenant', 'colonel', 'admiral', 'captian', 'major'],
    guildOnly: true,
    async execute(msg: Message, words: Array<string>, word: string) {
        let idx = words.indexOf(word);
        if (words[idx + 1] === undefined) return;
        const text = `${capitalize(word)} ${capitalize(words[idx + 1])}`;
        const canvas = createCanvas(300, 300);
        const ctx = canvas.getContext('2d');
        const bg = await loadImage('https://static-cdn.jtvnw.net/jtv_user_pictures/kkomrade-profile_image-af4f674dbc67fcd4-300x300.png');
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        ctx.font = '30px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        const width = ctx.measureText(text).width / 2;
        ctx.strokeText(text, 180 - width, 40);
        ctx.fillText(text, 180 - width, 40);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'salute.png');
        attachment.width = 300;
        attachment.height = 300;
        msg.channel.send(text, attachment);
    }
}