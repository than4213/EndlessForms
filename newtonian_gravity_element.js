import EndlessForms from './endless_forms.js'
import { step } from './newtonian_gravity_physics.js'
import { lMagnitude2, lSubtract, replicate } from './util.js'

const PI2 = 2 * Math.PI

export class NewtonianGravity extends EndlessForms {
    generate(dimensions) {
        const QUANTITY = 1000

        const particles = replicate(QUANTITY, () => ({
            position: dimensions.map((dim) => (Math.random() - .5) * dim),
            velocity: dimensions.map(() => Math.random() - .5),
            mass: 1
        }))

        return { particles }
    }

    clickHandler({ clientX, clientY, target }, { particles, red, green }) {
        const clickPos = [ clientX - target.width * .5, clientY - target.height * .5 ]
        const { index } = particles.reduce((res, { position }, ind) => {
            const thisDist = lMagnitude2(lSubtract(clickPos, position))
            return thisDist < res.d2 ? { index: ind, d2: thisDist } : res
        }, { d2: Number.MAX_SAFE_INTEGER })
        red = red === index ? null : green == null || green === index ? red : index
        green = green === index ? null : green == null ? index : green
        return { particles, red, green }
    }

    simulate(data, width, height) {
        data = step(data)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawParticles(canvas, data)
        return { data, canvas }
    }
}
customElements.define('newtonian-gravity', NewtonianGravity);

function drawParticles(canvas, { particles, green, red }) {
    const ctx = canvas.getContext('2d')
    const midW = canvas.width * .5
    const midH = canvas.height * .5
    for (let i = 0; i < particles.length; i ++) {
        const { position: [ x, y ], mass } = particles[i] 
        ctx.fillStyle = i === green ? 'green' : i === red ? 'red' : 'white';
        ctx.beginPath()
        ctx.arc(x + midW, y + midH, Math.cbrt(mass), 0, PI2)
        ctx.fill()
    }
}
