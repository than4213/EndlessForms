import EndlessForms from './endless_forms.js'
import { replicate } from './util.js';

const minDist = 1000

class BinomialDistribution extends EndlessForms {
    defaultConfig() { }

    generate() {
        this.data = replicate(this.canvas.clientWidth, () => 0)
        this.data[Math.floor((this.data.length - .5) / 2)] = 1
        this.data[Math.floor(this.data.length / 2)] = 1

        this.wave = replicate(this.data.length, (i) => {
            return replicate(this.data.length, (j) => {
                const wavelength = i + 1
                const x = j + minDist
                const phase = x % wavelength
                const isDown = (Math.floor(x / wavelength) % 2) == 0
                const ratio = phase / wavelength
                return isDown ? 1 - ratio : ratio
            })
        })
    }

    step() {
        this.data = calculate(calculate(this.data))
    }

    getCanvas() {
        return getCanvas(this.data, this.canvas.width, this.canvas.height, this.wave)
    }

    clickHandler() {
        this.step()
    }
}
customElements.define('binomial-distribution', BinomialDistribution)

function calculate(data) {
    if (data[0] > .01) {
        return data
    }
    const newData = replicate(data.length, () => 0)
    for (let i = 1; i < data.length - 1; i ++) {
        newData[i - 1] += data[i] * .5
        newData[i] += data[i]
        newData[i + 1] += data[i] * .5
    }
    const max = Math.max(...newData)
    return newData.map((val) => val / max)
}

function getCanvas(data, width, height, wave) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "green"
    ctx.beginPath();
    ctx.moveTo(0, (1 - data[0]) * height)
    for (let i = 1; i < data.length; i ++) {
        ctx.lineTo(i, (1 - data[i]) * height)
    }
    ctx.stroke()

    const waveDist = toWaveDist(wave, data)
    ctx.beginPath();
    ctx.strokeStyle = "red"
    ctx.moveTo(0, (1 - waveDist[0]) * height)
    for (let i = 1; i < waveDist.length; i ++) {
        ctx.lineTo(i, (1 - waveDist[i]) * height)
    }
    ctx.stroke()
    return canvas
}

function toWaveDist(wave, data) {
    const mult = 1 / data.length;
    const waveDist = replicate(data.length, (i) => {
        return wave.reduce((prev, cur, j) => prev + data[j] * cur[i] / Math.pow((i + minDist) * mult, 2), 0)
    })
    const max = Math.max(...waveDist)
    return waveDist.map((val) => val / max)
}