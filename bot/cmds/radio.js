const join = require('./join.js')
const util = require('../utils.js')

module.exports = {
    name: 'radio',
    aliases: [],
    description: 'listen.moe radio',
    usage: '',
    cooldown: 5,
    args: false,
    guildOnly: true,
    async execute(msg, args) {
        if (msg.client.connection === null) {
            await join.execute(msg, args);
        }

        if(msg.client.dispatcher === null) {
            console.log('Playing radio')
            msg.client.dispatcher = msg.client.connection.play('https://listen.moe/opus', { volume: .1}); // /stream
            msg.client.dispatcher.on('start', () => {
                console.log('Radio started');
                connect(msg);
                msg.delete();
            });

            msg.client.dispatcher.on('finish', () => {
                console.log('Radio finished');
                msg.client.dispatcher.destroy();
                msg.client.dispatcher = null;
            });

            msg.client.dispatcher.on('error',(error) => {
                console.error(error);
                msg.client.dispatcher.destroy();
                msg.client.dispatcher = null;
            });

            msg.client.dispatcher.on('debug', (error) => {
                console.error(error);
            });
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
                                value: util.duration(response.d.song.duration),
                                inline: true
                            },
                            {
                                name: 'Published',
                                value: response.d.startTime,
                                inline: true
                            },
                        ],
                        footer : {
                            text: `Listeners: ${response.d.listeners}`
                        }
                    };
                    if (msg.client.playerMessage == null) {
                        msg.channel.send({ embed : videoEmbed })
                        .then((item) => {
                            msg.client.playerMessage = item
                        });
                    } else {
                        msg.client.playerMessage.edit({ embed : videoEmbed })
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
		clearInterval(heartbeatInterval);
		heartbeatInterval = null;
		if (ws) {
			ws.close();
			ws = null;
		}
		setTimeout(() => connect(), 5000);
	};
}