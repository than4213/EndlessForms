import EndlessForms from './endless_forms.js'
import { generate, step } from './newtonian_gravity_physics.js'
import { lMagnitude2, lSubtract } from './util.js'

const PI2 = 2 * Math.PI

class NewtonianGravity extends EndlessForms {
    defaultConfig() {
        this.config = { quantity: 1000 }
    }

    generate() {
        this.data = generate(
            [ this.canvas.clientWidth, this.canvas.clientHeight ], this.config.quantity)
    }

    step() {
        this.data = step(this.data)
    }

    getCanvas() {
        return getCanvas(this.data, this.canvas.width, this.canvas.height)
    }

    clickHandler({ clientX, clientY, target }) {
        this.data = clickHandler(
            clientX, clientY, target, this.data.particles, this.data.red, this.data.green)
    }
}
customElements.define('newtonian-gravity', NewtonianGravity)

function getCanvas(data, width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawParticles(canvas, data)
    return canvas
}

function drawParticles(canvas, { particles, green, red }) {
    const ctx = canvas.getContext('2d')
    const midW = canvas.width * .5
    const midH = canvas.height * .5
    for (let i = 0; i < particles.length; i ++) {
        const { position: [ x, y ], mass } = particles[i] 
        ctx.fillStyle = i === green ? 'green' : i === red ? 'red' : 'white'
        ctx.beginPath()
        ctx.arc(x + midW, y + midH, Math.cbrt(mass), 0, PI2)
        ctx.fill()
    }
}

function clickHandler(clientX, clientY, target, particles, red, green) {
    const clickPos = [ clientX - target.width * .5, clientY - target.height * .5 ]
    const { index } = particles.reduce((res, { position }, ind) => {
        const thisDist = lMagnitude2(lSubtract(clickPos, position))
        return thisDist < res.d2 ? { index: ind, d2: thisDist } : res
    }, { d2: Number.MAX_SAFE_INTEGER })
    red = red === index ? null : green == null || green === index ? red : index
    green = green === index ? null : green == null ? index : green
    return { particles, red, green }
}
