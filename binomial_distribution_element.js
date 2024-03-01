import EndlessForms from './endless_forms.js'

class BinomialDistribution extends EndlessForms {
    defaultConfig() { }

    generate() {
        this.data = [1, 1]
    }

    step() {
        this.data = calculate(calculate(this.data))
    }

    getCanvas() {
        return getCanvas(this.data, this.canvas.width, this.canvas.height)
    }

    clickHandler() {
        this.step()
    }
}
customElements.define('binomial-distribution', BinomialDistribution)

function calculate(data) {
    const newData = Array(data.length + 1)
    newData[0] = data[0] / 2
    newData[data.length] = newData[0]
    for (let i = 1; i < data.length; i ++) {
        newData[i] = (data[i - 1] + data[i]) / 2
    }
    return newData
}

function getCanvas(data, width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const totBars = 100
    const barWidth = width / totBars
    const xAdd = (data.length - totBars) / 2
    ctx.fillStyle = "green"
    for (let i = 0; i < totBars; i ++) {
        const dataInd = i + xAdd
        const barHeight = dataInd < 0 || dataInd >= data.length ? 0 : data[dataInd] * height;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight)
    }
    return canvas
}
