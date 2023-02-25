import EndlessForms from './endless_forms.js'
import { replicate } from './util.js'

const TARGET_CELLS = 1000000

class QuantumField extends EndlessForms {
    generate(dimensions) {
        const length = dimensions.map((d) => Math.ceil(d / getScale(dimensions)))
        return replicate(length[0], () => replicate(length[1], () => (Math.random() - .5) * .2))
    }

    simulate(data, width, height) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const scale = getScale([width, height])
        for (let i = 0; i < data.length; i ++) {
            for (let j = 0; j < data[i].length; j ++) {
                const shade = (data[i][j] + 1) * 128
                ctx.fillStyle = `rgb(${shade},${shade},${shade})`
                ctx.fillRect(i * scale, j * scale, scale, scale)
            }
        }
        return { data, canvas }
    }
}
customElements.define('quantum-field', QuantumField)

function getScale(dimensions) {
    return Math.ceil(Math.sqrt(dimensions.reduce((a,c) => a * c) / TARGET_CELLS))
}