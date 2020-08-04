import { Collection, VoiceConnection, StreamDispatcher, Message } from 'discord.js';
import { readdirSync, readFileSync } from 'fs';
import { Queue } from './queue';
import { createServer } from 'https';
import * as WebSocket from 'ws';

export default class Settings {
    private static instance: Settings;
    cmds: Collection<string, object> = new Collection();
    connection: VoiceConnection = null;
    dispatcher: StreamDispatcher = null;
    songs = new Queue(100);
    autoplay = false;
    autoplayNext: string = null;
    playerMessage: Message = null;
    currentSong: object = null;
    sockets: Array<WebSocket> = [];
    always = false;
    alwaysCMDS: Collection<string, object> = new Collection();

    private constructor() {
        
    }

    static getInstance(): Settings {
        if (!Settings.instance) {
            Settings.instance = new Settings();
        }
        return Settings.instance;
    }

    init(cmdFolder: string) {
        if (!cmdFolder.endsWith('/')) {
            cmdFolder = `${cmdFolder}/`
        }
        this.loadCMDS(cmdFolder);
        this.startWS();
    }

    private loadCMDS(cmdFolder: string) { //cmdFolder needs trailing /
        const cmdDir =  readdirSync(cmdFolder, { withFileTypes: true });
        const cmdFiles = cmdDir.filter(dirent => dirent.isFile() && dirent.name.endsWith('.js')).map(dirent => dirent.name);
        const cmdDirectories = cmdDir.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
        for (const file of cmdFiles) {
            const cmd = require(`${cmdFolder}${file}`);
            if (cmd.always) {
                this.alwaysCMDS.set(cmd.name, cmd);
            } else {
                this.cmds.set(cmd.name, cmd);
            }
        }
    
        for (const dir of cmdDirectories) {
            const files = readdirSync(`${cmdFolder}${dir}`, { withFileTypes: true }).filter(dirent => dirent.isFile() && dirent.name.endsWith('.js')).map(dirent => dirent.name);
            for (const file of files) {
                const cmd = require(`./cmds/${dir}/${file}`);
                if (cmd.always) {
                    this.alwaysCMDS.set(cmd.name, cmd);
                } else {
                    this.cmds.set(cmd.name, cmd);
                }
            }
        }
    } 
    
    private startWS() { 
        const server = createServer({
            cert: readFileSync('certs/fullchain.pem', 'utf8'),
            key: readFileSync('certs/privkey.pem', 'utf8')
        })
        const wss = new WebSocket.Server({
            server
        })
        
        wss.on('connection', (ws, req) => {
            console.log(`Connected from ${req.socket.remoteAddress}`)
            this.sockets.push(ws)
            if (this.dispatcher !== null) { //currentSong
                ws.send(JSON.stringify(this.currentSong))
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
}