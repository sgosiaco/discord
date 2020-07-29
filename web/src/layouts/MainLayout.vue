<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar class="text-primary">
      <q-toolbar-title>
        Rimuru Bot Song Queue
      </q-toolbar-title>
      <q-toggle v-model="debug"/>
    </q-toolbar>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {},
  computed: {
    debug: {
      get () {
        return this.$store.state.settings.debug
      },
      set (value) {
        this.$store.commit('settings/debug', value)
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>
