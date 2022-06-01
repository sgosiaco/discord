import { Message, MessageAttachment } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import { capitalize } from '../../utils';

module.exports = {
  name: 'morb',
  aliases: [],
  description: '',
  usage: '',
  cooldown: 5,
  args: false,
  always: ['morb'],
  exact: false,
  guildOnly: true,
  async execute(msg: Message, words: Array<string>, word: string) {
    const text = `It's morbin' time`;
    const canvas = createCanvas(150, 205);
    const ctx = canvas.getContext('2d');
    const bg = await loadImage('./cmds/always/morbin.jpg');
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'morbin.png');
    attachment.width = 150;
    attachment.height = 205;
    msg.channel.send(text, attachment);
  }
}