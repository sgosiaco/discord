const Discord = require('discord.js');
const fs = require('fs');
const Queue = require('./queue.js');
const https = require('https');
const WebSocket = require('ws');
const join = require('./cmds/voice/join.js');

exports.uploaded = (published) => {
    const now = new Date(Date.now())
    const upload = new Date(published) // .toUTCString() // .toDateString()
    var days = Math.floor((now.getTime() - upload.getTime()) / (1000 * 3600 * 24))
    const vals = [{ time: 365, str: 'year' }, { time: 30, str: 'month' }, { time: 7, str: 'week' }, { time: 1, str: 'day' }]
    for (const value of vals) {
        if (days >= value.time) {
            var time = Math.floor(days / value.time)
            if (time === 1) {
              return `1 ${value.str} ago`
            }
            return `${time} ${value.str}s ago`
        }
    }
}

exports.duration = (length_seconds) => {
    var seconds = length_seconds
    var output = ''
    const vals = [3600, 60]
    vals.forEach((value, index) => {
        if (seconds >= value) {
            var time = Math.floor(seconds / value)
            seconds -= time * value
            output += output === '' ? `${time}:` : `${time.toString().padStart(2, '0')}:`
        }
    })
    output += output === '' ? `0:${seconds.toString().padStart(2, '0')}` : `${seconds.toString().padStart(2, '0')}`
    return output
}

exports.initClient = (client, cmdFolder) => {
    client.cmds = new Discord.Collection();
    client.connection = null;
    client.dispatcher = null;
    client.songs = new Queue(100);
    client.autoplay = false;
    client.autoplayNext = null;
    client.playerMessage = null;
    client.currentSong = null;
    client.sockets = [];
    client.always = false;
    client.alwaysCMDS = new Discord.Collection();
    if (!cmdFolder.endsWith('/')) {
        cmdFolder = `${cmdFolder}/`
    }
    this.loadCMDS(client, cmdFolder);
    this.startWS(client);
}

exports.loadCMDS = (client, cmdFolder) => { //cmdFolder needs trailing /
    const cmdDir =  fs.readdirSync(cmdFolder, { withFileTypes: true });
    const cmdFiles = cmdDir.filter(dirent => dirent.isFile() && dirent.name.endsWith('.js')).map(dirent => dirent.name);
    const cmdDirectories = cmdDir.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    for (const file of cmdFiles) {
        const cmd = require(`${cmdFolder}${file}`);
        if (cmd.always) {
            client.alwaysCMDS.set(cmd.name, cmd);
        } else {
            client.cmds.set(cmd.name, cmd);
        }
    }

    for (const dir of cmdDirectories) {
        const files = fs.readdirSync(`${cmdFolder}${dir}`, { withFileTypes: true }).filter(dirent => dirent.isFile() && dirent.name.endsWith('.js')).map(dirent => dirent.name);
        for (const file of files) {
            const cmd = require(`./cmds/${dir}/${file}`);
            if (cmd.always) {
                client.alwaysCMDS.set(cmd.name, cmd);
            } else {
                client.cmds.set(cmd.name, cmd);
            }
        }
    }
} 

exports.startWS = (client) => {
    const server = https.createServer({
        cert: fs.readFileSync('certs/fullchain.pem', 'utf8'),
        key: fs.readFileSync('certs/privkey.pem', 'utf8')
    })
    const wss = new WebSocket.Server({
        server
    })
    
    wss.on('connection', (ws, req) => {
        console.log(`Connected from ${req.socket.remoteAddress}`)
        client.sockets.push(ws)
        if (client.dispatcher !== null) { //currentSong
            ws.send(JSON.stringify(client.currentSong))
            //maybe send queue here?
        }
        ws.on('open', () => {
            console.log('WS opened')
        })
        ws.on('message', (message) => {
            console.log(`Received: ${message}`)
            ws.send(`Received: ${message}`)
        })
        ws.on('close', (code, reason) => {
            console.log(`Closed: ${reason}`)
        })
    })
    server.listen(3000)
}

exports.playStream = async (msg, stream, options) => {
    if (msg.client.connection === null) {
        await join.execute(msg, args);
    }

    if(msg.client.dispatcher === null) {
        console.log('Playing stream')
        msg.client.dispatcher = msg.client.connection.play(stream, options);
        msg.client.dispatcher.on('start', () => {
            console.log('Stream started');
        });

        msg.client.dispatcher.on('finish', () => {
            console.log('Stream finished');
            msg.client.dispatcher.destroy();
            msg.client.dispatcher = null;
        });

        msg.client.dispatcher.on('error',(error) => {
            console.error(error);
            msg.client.dispatcher.destroy();
            msg.client.dispatcher = null;
        });

        msg.client.dispatcher.on('close', () => {
            console.log('Closed stream dispatcher');
        })
    }
}

exports.capitalize = (word) => {
    return `${word[0].toUpperCase()}${word.slice(1)}`;
}