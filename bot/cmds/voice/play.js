const join = require('./join.js')
const yt = require('ytdl-core')
const ytdl = require('ytdl-core-discord')
const pattern = new RegExp('^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+');
const util = require('../../utils.js')
const Discord = require('discord.js');

module.exports = {
    name: 'play',
    aliases: ['add'],
    description: 'Play media, autojoins vc if not already in channel',
    usage: '',
    cooldown: 5,
    args: true,
    guildOnly: true,
    async execute(msg, args) {
        // add arg checking here before everything else
        if (!pattern.test(args[0])) {
            return msg.reply('Please use a valid youtube link!');
        }

        if (msg.client.connection === null) {
            await join.execute(msg, args);
        }
        
        if (msg.client.dispatcher === null) {
            console.log(args[0]);
            yt.getInfo(args[0], (err, info) => {
                if(err) {
                    return msg.reply('Error occured trying to load video info!')
                }
                if (info.related_videos.length > 0) {
                    msg.client.autoplayNext = `https://www.youtube.com/watch?v=${info.related_videos[0].id}`
                } else {
                    msg.client.autoplayNext = null
                }
                const videoEmbed = {
                    color: 0x0099ff,
                    title: info.title,
                    url: args[0],
                    author: {
                        name: info.author.name,
                        url: info.author.channel_url,
                        icon_url: info.author.avatar
                    },
                    thumbnail: {
                        url: `https://img.youtube.com/vi/${info.video_id}/hqdefault.jpg`
                    },
                    fields: [
                        {
                            name: 'Length',
                            value: util.duration(info.length_seconds),
                            inline: true
                        },
                        {
                            name: 'Published',
                            value: util.uploaded(info.published),
                            inline: true
                        },
                    ],
                    footer : {
                        text: `Autoplay: ${msg.client.autoplay ? 'on' : 'off'} | Queue ${msg.client.songs.size}`
                    }
                };
                msg.suppressEmbeds(); //don't delete and instead suppress embed to keep song history?
                if (msg.client.playerMessage == null) {
                    msg.channel.send({ embed : videoEmbed })
                    .then((item) => {
                        msg.client.playerMessage = item
                    });
                } else {
                    msg.client.playerMessage.edit({ embed : videoEmbed })
                }
                msg.client.sockets.forEach(socket => {
                    socket.send(args[0])
                    socket.send(JSON.stringify(info))
                })
                msg.client.currentSong = info
            })
            msg.client.dispatcher = msg.client.connection.play(await ytdl(args[0]), { type: 'opus', volume: 0.1 }); //ytdl(args[0], { quality: 'highestaudio' })

            msg.client.dispatcher.on('start', () => {
                console.log('playing');
                //msg.channel.send(`Now playing: ${args[0]}`);
            });

            msg.client.dispatcher.on('finish', () => {
                console.log('finished');
                msg.client.dispatcher.destroy();
                msg.client.dispatcher = null;
                if (!msg.client.songs.isEmpty()) {
                    let song = [];
                    song.push(msg.client.songs.dequeue());
                    this.execute(msg, song);
                } else if (msg.client.autoplay && msg.client.autoplayNext !== null) {
                    let song = [];
                    song.push(msg.client.autoplayNext);
                    console.log(`Autoplaying ${msg.client.autoplayNext}`)
                    this.execute(msg, song);
                } else {
                    msg.client.playerMessage.delete();
                    msg.client.playerMessage = null;
                }
                //start auto leave timer?
            });

            msg.client.dispatcher.on('error',(error) => {
                console.error(error);
                msg.client.dispatcher.destroy();
                msg.client.dispatcher = null;
            });

            msg.client.dispatcher.on('close', () => {
                console.log('Closed dispatcher');
            });

        } else {
            //add song to queue
            msg.client.songs.enqueue(args[0])
            console.log(`Added to queue ${msg.client.songs.getLast()}`);
            msg.delete();
            msg.reply(`Added to queue: ${args[0]}`)
                .then((item) => {
                    item.suppressEmbeds();
                });
            const embed = new Discord.MessageEmbed(msg.client.playerMessage.embeds[0]).setFooter(`Autoplay: ${msg.client.autoplay ? 'on' : 'off'} | Queue ${msg.client.songs.getSize()}`)
            msg.client.playerMessage.edit(embed);
        }
    }
}