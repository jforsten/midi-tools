<template>
  <v-container>
    <v-card>
      <v-card-title>
        QuickControl 
        <indicator :color='indicator.color' />
      </v-card-title>
      <v-container>
        <v-row>
          <v-col>
              <v-btn
                class="ma-1"
                rounded
                color="primary"
                @click="action('90 2e 7f 90 2e 00')"
              >
              Bank Prev
              </v-btn>
              <v-btn
                class="ma-1"
                rounded
                color="primary"
                @click="action('90 2f 7f 90 2f 00')"
              >
              Bank Next
              </v-btn>
         </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import toolbase from '@/mixins/toolbase'
import { Helpers } from '../../utils/helpers'

export default {
  
  name: 'QuickControl',
  mixins: [toolbase],
  props: {},

  data: () => ({ }),

  methods: {

    process(data) {
      console.log(data)
      //this.send(data)
      this.showIndicator()
    },

    action(data) {
        this.send(Helpers.hex2buf(data))
        this.showIndicator()
    }

  },

}
</script>
