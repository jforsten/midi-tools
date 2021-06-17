<template>
    <v-container>
        <v-sparkline />
    </v-container>
</template>

<script>
import midimodule from '@/mixins/midimodule'

export default {
    name: "Tremolo",
    mixins: [midimodule],

    data: () => ({}),
    
    methods: {

    }
}
</script>