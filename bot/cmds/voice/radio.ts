import { Message } from 'discord.js';
import Settings from '../../settings';
import * as join from './join';
import { duration } from '../../utils';
import Command from '../Command';

module.exports = {
    name: 'radio',
    aliases: [],
    description: 'listen.moe radio',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    async execute(msg: Message, args: Array<string>) {
        const settings = Settings.getInstance();
        if (settings.connection === null) {
            await (join as Command).execute(msg, args);
        }

        if(settings.dispatcher === null) {
            console.log('Playing radio')
            settings.dispatcher = settings.connection.play('https://listen.moe/opus', { volume: .1}); // /stream
            settings.dispatcher.on('start', () => {
                console.log('Radio started');
                connect(msg);
                msg.delete();
            });

            settings.dispatcher.on('finish', () => {
                console.log('Radio finished');
                settings.dispatcher.destroy();
                settings.dispatcher = null;
            });

            settings.dispatcher.on('error',(error) => {
                console.error(error);
                settings.dispatcher.destroy();
                settings.dispatcher = null;
            });

            settings.dispatcher.on('close', () => {
                console.log('Closed Radio dispatcher');
                ws.close()
            })
        }
    }
}

const WebSocket = require('ws')
let heartbeatInterval;
let ws;

function heartbeat(interval) {
	heartbeatInterval = setInterval(() => {
		ws.send(JSON.stringify({ op: 9 }));
	}, interval);
}

function connect(msg) {
    ws = new WebSocket('wss://listen.moe/gateway_v2');

	ws.onopen = () => {
		clearInterval(heartbeatInterval);
		heartbeatInterval = null;
	};

	ws.onmessage = message => {
        if (!message.data.length) return;
        let response;
        const settings = Settings.getInstance()
		try {
			response = JSON.parse(message.data);
		} catch (error) {
			return;
        }
        if (response.op == 0) {
            ws.send(JSON.stringify({ op: 9 }));
			heartbeat(response.d.heartbeat);
        } else if (response.op == 1) {
            switch (response.t) {
                case 'TRACK_UPDATE':
                    const videoEmbed = {
                        color: 0x0099ff,
                        title: response.d.song.title,
                        url: 'https://listen.moe/',
                        author: {
                            name: response.d.song.artists[0].name
                        },
                        fields: [
                            {
                                name: 'Length',
                                value: duration(response.d.song.duration),
                                inline: true
                            },
                            {
                                name: 'Published',
                                value: response.d.startTime,
                                inline: true
                            },
                        ],
                        footer : {
                            text: `Listeners: ${response.d.listeners} | Volume ${settings.dispatcher.volume*100}%`
                        }
                    };
                    if (settings.playerMessage == null) {
                        msg.channel.send({ embed : videoEmbed })
                        .then((item) => {
                            settings.playerMessage = item
                        });
                    } else {
                        settings.playerMessage.edit({ embed : videoEmbed })
                    }
                    break;
                case 'TRACK_UPDATE_REQUEST':
                    break;
                case 'QUEUE_UPDATE':
                    break;
                case 'NOTIFICATION':
                    break;
                default:
                    break;
            }
			console.log(response.d); // Do something with the data
        }
	};

	ws.onclose = error => {
        console.log('Closed radio WS');
		clearInterval(heartbeatInterval);
		heartbeatInterval = null;
		if (ws) {
			ws.close();
			ws = null;
		}
		if (error) {
            setTimeout(() => connect(msg), 5000);
        }
	};
}