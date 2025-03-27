import EndlessForms from './endless_forms.js'
import { replicate } from './util.js';

class BinomialDistribution extends EndlessForms {
    defaultConfig() {
        this.config = { p: .5 }
     }

    generate() {
        this.data = [1]
    }

    step() {
        this.data = calculate(this.config, this.data)
    }

    getCanvas() {
        return getCanvas(this.data, this.canvas.width, this.canvas.height)
    }

    clickHandler() {
        this.step()
    }
}
customElements.define('binomial-distribution', BinomialDistribution)

function calculate(config, data) {
    const newData = replicate(data.length + 1, () => 0)
    for (let i = 0; i < data.length; i ++) {
        newData[i] += data[i] * (1-config.p)
        newData[i+1] += data[i] * config.p
    }
    const max = Math.max(...newData)
    return newData.map((val) => val / max)
}

function getCanvas(data, width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "green"
    ctx.beginPath();
    ctx.moveTo(0, (1 - data[0]) * height)
    const binWidth = width / data.length
    for (let i = 0; i < data.length; i ++) {
        ctx.lineTo((i+1)*binWidth, (1 - data[i]) * height)
    }
    ctx.stroke()
    return canvas
}
