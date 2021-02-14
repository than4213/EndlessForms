import { step } from './physics.js'

const PI2 = 2 * Math.PI

export const simulations = {
    NewtonianGravity(data, width, height) {
        data = step(data)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawParticles(canvas, data)
        return { data, canvas }
    },
}

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