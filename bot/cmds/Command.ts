import { Message } from 'discord.js';

export default interface Command {
    name: string;
    aliases: Array<string>;
    description: string;
    usage: string;
    cooldown: number;
    args: boolean;
    always: Array<string>;
    guildOnly: boolean;
    execute(...args: any[])
}