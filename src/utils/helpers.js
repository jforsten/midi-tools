export const Helpers = {

    blink(prop) {
        prop.color = prop.activeColor
        this.delay(50).then(() => {
          prop.color = prop.inactiveColor
        })
    },

    delay (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

}