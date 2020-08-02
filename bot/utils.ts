const join = require('./cmds/voice/join.js'); // still need to convert!!

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

export function capitalize(word) {
    return `${word[0].toUpperCase()}${word.slice(1)}`;
}