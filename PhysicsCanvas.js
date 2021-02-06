const PI2 = 2 * Math.PI

export function createCanvas(data, width, height) {
    const cnv = document.createElement('canvas')
    cnv.width = width
    cnv.height = height
    const ctx = cnv.getContext('2d')
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    ctx.fillStyle = "white";
    const multView = Math.min(width, height)
    const midW = width * .5
    const midH = height * .5
    for (const { position: [ x, y, z ], mass } of data) {
        if (z <= 0 - multView)
            continue
        const mult = multView / (z + multView)
        const viewX = x * mult + midW
        const viewY = y * mult + midH
        const radius = Math.cbrt(mass) * mult
        ctx.beginPath()
        ctx.arc(viewX, viewY, radius, 0, PI2)
        ctx.fill()
    }
    return cnv
}
