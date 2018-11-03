const PI2 = 2 * Math.PI

export function newCanvas(width, height) {
    const cnv = document.createElement('canvas')
    cnv.width = width
    cnv.height = height
    return cnv
}

export class FieldDrawer {
    constructor(field, particles) {
        this._field = field
        this._particles = particles
    }

    getCanvas() {
        const cnv = newCanvas(this._field.length, this._field[0].length)
        const ctx = cnv.getContext('2d')
        const imgData = ctx.createImageData(cnv.width, cnv.height)
        for (let i = 0; i < this._field.length; i ++) {
            for (let j = 0; j < this._field[i].length; j ++) {
                const imgInd = (i + j * imgData.width) * 4
                const shade = 128 + Math.floor(this._field[i][j] * 10)
                imgData.data[imgInd] = shade
                imgData.data[imgInd + 1] = shade
                imgData.data[imgInd + 2] = shade
                imgData.data[imgInd + 3] = 255
            }
        }
        ctx.putImageData(imgData, 0, 0)

        ctx.fillStyle = 'green'
        for (let particle of this._particles) {
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, Math.sqrt(particle.mass), 0, PI2)

            ctx.fill()
        }

        return cnv
    }


}