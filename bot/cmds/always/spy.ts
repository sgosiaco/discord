import { Message, MessageAttachment } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import { capitalize } from '../../utils';

module.exports = {
  name: 'spy',
  aliases: [],
  description: '',
  usage: '',
  cooldown: 5,
  args: false,
  always: ['spy'],
  exact: false,
  guildOnly: true,
  async execute(msg: Message, words: Array<string>, word: string) {
    const text = `https://cdn.discordapp.com/attachments/737100075527831563/1004213683620163735/spy.webm`;
    msg.channel.send(text)
  }
}