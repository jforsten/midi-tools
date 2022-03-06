<template>
  <v-app>

    <v-app-bar app color="primary" dark>
      <v-toolbar-title fixed>
        <v-icon>mdi-midi-port</v-icon>
        midi.tools
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>

    <v-main class="grey lighten-2">
      <ToolContainer />
    </v-main>
  <div class="copyright pe-2"> ©Juha Forsten 2022 </div>
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
.copyright {
    text-align: right;
    color: #fff; /* Fallback for older browsers */
    color: rgba(0, 0, 0, 0.3);
    background: #e0e0e0;
    font-size: 8pt;
    font-family: Arial, sans-serif;
}
</style>
