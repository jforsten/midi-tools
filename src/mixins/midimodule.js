import { Helpers } from '@/utils/helpers'
import Indicator  from '@/components/Indicator.vue'

export default {
    components: {Indicator},
    data: () => ({
        indicator: {
            color: '#DDDDDD',
            activeColor: '#FF0000',
            inactiveColor: '#DDDDDD',
          },
    }),
    methods: {

        receive(data) {
            this.process(data)
        },
      
        send(data) {
            this.$emit('sendMidi', data)
        },

        process() {
            // overload in component!
        },

        showIndicator() {
            Helpers.blink(this.indicator)
        },

    },

    mounted() {
        this.$root.$on('onReceiveMidi', this.receive)
    },
    
    beforeDestroy() {
        this.$root.$off('onReceiveMidi')
    },

  }