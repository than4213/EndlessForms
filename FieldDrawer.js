const PI2 = 2 * Math.PI

export function newCanvas(width, height) {
    const cnv = document.createElement('canvas')
    cnv.width = width
    cnv.height = height
    return cnv
}

export class FieldDrawer {
    constructor(controller) {
        this._controller = controller
        this._low = -1
        this._high = 1
    }

    getCanvas() {
        const field = this._controller.getField()
        const cnv = newCanvas(field.length, field[0].length)
        const ctx = cnv.getContext('2d')
        const imgData = ctx.createImageData(cnv.width, cnv.height)
        let newLow = this._low
        let newHigh = this._high
        const mult = 256 / (newHigh * .5 - newLow)
        for (let i = 0; i < field.length; i ++) {
            for (let j = 0; j < field[i].length; j ++) {
                const imgInd = (i + j * imgData.width) * 4
                const shade = Math.floor(mult * (field[i][j] - this._low))
                newLow = Math.min(newLow, field[i][j])
                newHigh = Math.max(newHigh, field[i][j])
                imgData.data[imgInd] = shade
                imgData.data[imgInd + 1] = shade
                imgData.data[imgInd + 2] = shade
                imgData.data[imgInd + 3] = 255
            }
        }
        this._low = newLow
        this._high = newHigh
        ctx.putImageData(imgData, 0, 0)

        ctx.fillStyle = 'green'
        for (let particle of this._controller.getParticles()) {
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, Math.sqrt(particle.mass), 0, PI2)
            ctx.fill()
        }

        return cnv
    }


}