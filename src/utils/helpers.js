export const Helpers = {

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    blink(prop) {
        prop.color = prop.activeColor
        this.delay(50).then(() => {
          prop.color = prop.inactiveColor
        })
    },

    delay (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    },

    buf2hex(buffer) { // buffer is an ArrayBuffer
        return [...new Uint8Array(buffer)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join(' ')
    },

    hex2buf(hex) {
        hex = hex.replace(/\s/g, '')
        var buf = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
          }))
        return buf
    }

}