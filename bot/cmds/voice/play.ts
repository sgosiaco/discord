import * as join from './join';
import ytdl from 'ytdl-core-discord';
import { duration, uploaded } from '../../utils';
import { Message, MessageEmbed } from 'discord.js';
import Settings from '../../settings';
const pattern = new RegExp('^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+');
import Command from '../Command';

module.exports = {
    name: 'play',
    aliases: ['add'],
    description: 'Play media, autojoins vc if not already in channel',
    usage: '',
    cooldown: 5,
    args: true,
    guildOnly: true,
    async execute(msg: Message, args: Array<string>) {
        // add arg checking here before everything else
        const settings = Settings.getInstance();
        if (!pattern.test(args[0])) {
            return msg.reply('Please use a valid youtube link!');
        }

        if (settings.connection === null) {
            await (join as Command).execute(msg, args);
        }
        
        if (settings.dispatcher === null) {
            console.log(args[0]);
            try {
                const info = await ytdl.getInfo(args[0])
                if (info.related_videos.length > 0) {
                    settings.autoplayNext = `https://www.youtube.com/watch?v=${info.related_videos[0].id}`
                } else {
                    settings.autoplayNext = null
                }
                const videoEmbed = {
                    color: 0x0099ff,
                    title: info.videoDetails.title,
                    url: args[0],
                    author: {
                        name: info.videoDetails.author.name,
                        url: info.videoDetails.author.channel_url,
                        icon_url: info.videoDetails.author.avatar
                    },
                    thumbnail: {
                        url: `https://img.youtube.com/vi/${info.videoDetails.video_id}/hqdefault.jpg`
                    },
                    fields: [
                        {
                            name: 'Length',
                            value: duration(info.videoDetails.lengthSeconds),
                            inline: true
                        },
                        {
                            name: 'Published',
                            value: uploaded(info.videoDetails.published),
                            inline: true
                        },
                    ],
                    footer : {
                        text: `Autoplay: ${settings.autoplay ? 'on' : 'off'} | Queue ${settings.songs.size}`
                    }
                };
                msg.suppressEmbeds(); //don't delete and instead suppress embed to keep song history?
                if (settings.playerMessage == null) {
                    msg.channel.send({ embed : videoEmbed })
                    .then((item) => {
                        settings.playerMessage = item
                    });
                } else {
                    settings.playerMessage.edit({ embed : videoEmbed })
                }
                settings.sockets.forEach(socket => {
                    socket.send(args[0])
                    socket.send(JSON.stringify(info))
                })
                settings.currentSong = info
            } catch (e) {
                return msg.reply('Error occured trying to load video info!')
            }
            settings.dispatcher = settings.connection.play(await ytdl(args[0]), { type: 'opus', volume: 0.1 }); //ytdl(args[0], { quality: 'highestaudio' })

            settings.dispatcher.on('start', () => {
                console.log('playing');
                //msg.channel.send(`Now playing: ${args[0]}`);
            });

            settings.dispatcher.on('finish', () => {
                console.log('finished');
                settings.dispatcher.destroy();
                settings.dispatcher = null;
                if (!settings.songs.isEmpty()) {
                    let song = [];
                    song.push(settings.songs.dequeue());
                    this.execute(msg, song);
                } else if (settings.autoplay && settings.autoplayNext !== null) {
                    let song = [];
                    song.push(settings.autoplayNext);
                    console.log(`Autoplaying ${settings.autoplayNext}`)
                    this.execute(msg, song);
                } else {
                    settings.playerMessage.delete();
                    settings.playerMessage = null;
                }
                //start auto leave timer?
            });

            settings.dispatcher.on('error',(error) => {
                console.error(error);
                settings.dispatcher.destroy();
                settings.dispatcher = null;
            });

            settings.dispatcher.on('close', () => {
                console.log('Closed dispatcher');
            });

        } else {
            //add song to queue
            settings.songs.enqueue(args[0])
            console.log(`Added to queue ${settings.songs.getLast()}`);
            msg.delete();
            msg.reply(`Added to queue: ${args[0]}`)
                .then((item) => {
                    item.suppressEmbeds();
                });
            const embed = new MessageEmbed(settings.playerMessage.embeds[0]).setFooter(`Autoplay: ${settings.autoplay ? 'on' : 'off'} | Queue ${settings.songs.getSize()}`)
            settings.playerMessage.edit(embed);
        }
    }
}