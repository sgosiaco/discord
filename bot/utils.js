module.exports.uploaded = (published) => {
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

module.exports.duration = (length_seconds) => {
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