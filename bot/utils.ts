import * as join from './cmds/voice/join';
import Settings from './settings';

export function uploaded(published) {
    const now = new Date(Date.now())
    const upload = new Date(published) // .toUTCString() // .toDateString()
    let days = Math.floor((now.getTime() - upload.getTime()) / (1000 * 3600 * 24))
    const vals = [{ time: 365, str: 'year' }, { time: 30, str: 'month' }, { time: 7, str: 'week' }, { time: 1, str: 'day' }]
    for (const value of vals) {
        if (days >= value.time) {
            let time = Math.floor(days / value.time)
            if (time === 1) {
              return `1 ${value.str} ago`
            }
            return `${time} ${value.str}s ago`
        }
    }
}

export function duration(length_seconds) {
    let seconds = length_seconds
    let output = ''
    const vals = [3600, 60]
    vals.forEach((value, index) => {
        if (seconds >= value) {
            let time = Math.floor(seconds / value)
            seconds -= time * value
            output += output === '' ? `${time}:` : `${time.toString().padStart(2, '0')}:`
        }
    })
    output += output === '' ? `0:${seconds.toString().padStart(2, '0')}` : `${seconds.toString().padStart(2, '0')}`
    return output
}

export async function playStream(msg, stream, options) {
    const settings = Settings.getInstance();
    if (settings.connection === null) {
        await join.execute(msg, args);
    }

    if(settings.dispatcher === null) {
        console.log('Playing stream')
        settings.dispatcher = settings.connection.play(stream, options);
        settings.dispatcher.on('start', () => {
            console.log('Stream started');
        });

        settings.dispatcher.on('finish', () => {
            console.log('Stream finished');
            settings.dispatcher.destroy();
            settings.dispatcher = null;
        });

        settings.dispatcher.on('error',(error) => {
            console.error(error);
            settings.dispatcher.destroy();
            settings.dispatcher = null;
        });

        settings.dispatcher.on('close', () => {
            console.log('Closed stream dispatcher');
        })
    }
}

export function capitalize(word) {
    return `${word[0].toUpperCase()}${word.slice(1)}`;
}