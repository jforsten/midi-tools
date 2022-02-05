<template>
  <v-container>
    <v-card>
      <v-card-title>
        Bypass 
        <indicator :color='indicator.color' />
      </v-card-title>
      <v-container>
        <v-row>
          <v-col> </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import toolbase from '@/mixins/toolbase'

export default {
  
  name: 'Bypass',
  mixins: [toolbase],
  props: {},

  data: () => ({ }),

  methods: {

    process(data) {
      this.send(data)
      this.showIndicator()
    },

  },

}
</script>
