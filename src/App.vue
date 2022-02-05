<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title fixed>
        <v-icon>mdi-midi-port</v-icon>
        midi.tools
      </v-toolbar-title>
    </v-app-bar>

    <v-main class="grey lighten-2">
      <ToolContainer />
    </v-main>

  </v-app>
</template>

<script>
import ToolContainer from './components/ToolContainer'

export default {
  name: 'App',

  components: {
    ToolContainer,
  },

  data: () => ({}),
}
</script>
<style lang="scss">
// Remove scrollbars if not needed
html {
  overflow-y: auto;
}
</style>
