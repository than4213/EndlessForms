import EndlessForms from './endless_forms.js'
import { generate, step } from './two_slit_physics.js'

const CHART_HEIGHT = 100

class TwoSlit extends EndlessForms {
    defaultConfig() {
        this.config = { force: .1, wavelength: 8, amplitude: 1 }
    }

    generate() {
        this.data = generate()
    }

    step() {
        this.data = step(
            this.config.force, this.config.wavelength, this.config.amplitude, this.data.cells,
            this.data.cycle, this.data.results)
    }

    getCanvas() {
        return getCanvas(this.data.cells, this.data.results, this.canvas.width, this.canvas.height)
    }
}
customElements.define('two-slit', TwoSlit)

function getCanvas(cells, results, width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const cellWidth = cells.length
    const cellHeight = cells[0].length
    const scale = Math.floor(Math.min(width / cellWidth, (height-CHART_HEIGHT) / cellHeight))
    const marginI = Math.floor((width - scale * cellWidth) * .5)
    const marginJ = Math.floor((height - scale * cellHeight) * .5 + CHART_HEIGHT)
    for (let i = 0; i < cells.length; i ++) {
        for (let j = 0; j < cells[i].length; j ++) {
            const shade = (cells[i][j].p + 1) * 128
            ctx.fillStyle = `rgb(${shade},${shade},${shade})`
            ctx.fillRect(marginI + i * scale, marginJ + j * scale, scale, scale)
        }
    }

    ctx.fillStyle = 'green'
    const max = Math.max(1, ...results)
    for (let i = 0; i < cells.length; i ++) {
        const resultHeight = 100 * (results[i]/max)
        ctx.fillRect(marginI + i * scale, marginJ - resultHeight, scale, resultHeight)
    }

    return canvas
}
