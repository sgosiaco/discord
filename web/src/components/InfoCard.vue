<template>
  <q-card style="width: fit-content"> <!--class="q-pa-xs"-->
    <q-card-section horizontal>
      <q-card-section style="max-width: 400px">
        <div class="text">{{localInfo.title}}</div>
        <div class="text-caption">{{localInfo.author.name}}</div>
        <div class="text-caption">{{uploaded}}</div>
      </q-card-section>
      <q-card-section>
        <q-img
          :src="thumbnail"
          spinner-color="white"
          style="height:90px; width:160px"
          class="rounded-borders"
        >
          <div class="fixed-bottom-right transparent">
            <q-badge color="black" text-color="white" :label="duration"/>
          </div>
        </q-img>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  computed: {
    localInfo: {
      get () {
        return this.info
      }
    },
    thumbnail: {
      get () {
        return `https://img.youtube.com/vi/${this.localInfo.video_id}/hqdefault.jpg`
      }
    },
    uploaded: {
      get () {
        const now = new Date(Date.now())
        const upload = new Date(this.localInfo.published) // .toUTCString() // .toDateString()
        var days = Math.floor((now.getTime() - upload.getTime()) / (1000 * 3600 * 24))
        const vals = [{ time: 365, str: 'year' }, { time: 30, str: 'month' }, { time: 7, str: 'week' }, { time: 1, str: 'day' }]
        for (const value of vals) {
          if (days >= value.time) {
            var time = Math.floor(days / value.time)
            return time === 1 ? `1 ${value.str} ago` : `${time} ${value.str}s ago`
          }
        }
        return ''
      }
    },
    duration: {
      get () {
        var seconds = this.localInfo.length_seconds
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
    }
  },
  data () {
    return {}
  }
}
</script>
