<template>
  <q-page class="flex flex-center">
    <div class="q-gutter-md row">
      <div class="q-gutter-y-md column fit justify-center">
        <InfoCard v-for="song in songList" v-bind="song" :key="song.url"></InfoCard>
      </div>
    </div>
  </q-page>
</template>

<script>
import InfoCard from 'components/InfoCard'
export default {
  name: 'PageIndex',
  components: {
    InfoCard
  },
  created: function () {
    this.$options.sockets.onmessage = (msg) => {
      try {
        const item = JSON.parse(msg.data)
        console.log(item)
        this.songs.unshift({
          url: item.video_url,
          info: item
        })
      } catch (e) {
        console.log(e)
        console.log(msg.data)
      }
    }
  },
  computed: {
    debug: {
      get () {
        return this.$store.state.settings.debug
      }
    },
    songList: function () {
      if (this.debug) {
        return [
          {
            url: 'https://youtube.com/something1',
            label: '',
            percentage: '0',
            loading: true,
            info: {
              title: 'BURNOUT SYNDROMES 『PHOENIX』Music Video（TVアニメ「ハイキュー!! TO THE TOP」オープニングテーマ',
              author: {
                name: ' BURNOUT SYNDROMES Official YouTube Channel'
              },
              video_id: 'b5lsuPxMFmw',
              length_seconds: 213,
              published: 1586217600000
            }
          },
          {
            url: 'https://youtube.com/something2',
            label: '',
            percentage: '0',
            loading: true,
            info: {
              title: 'BURNOUT SYNDROMES 『PHOENIX』Music Video（TVアニメ「ハイキュー!! TO THE TOP」オープニングテーマ',
              author: {
                name: ' BURNOUT SYNDROMES Official YouTube Channel'
              },
              video_id: 'b5lsuPxMFmw',
              length_seconds: 213,
              published: 1586217600000
            }
          }
        ]
      }
      return this.songs
    }
  },
  data () {
    return {
      songs: []
    }
  }
}
</script>
