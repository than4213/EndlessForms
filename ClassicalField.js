import { FieldDrawer } from './FieldDrawer.js'

const NEIGHBOR_MULT = 1 / (5 + 4 * Math.SQRT1_2)
const CORNER_MULT = NEIGHBOR_MULT * Math.SQRT1_2

function mod(a, b) {
    return (a + b) % b
}

function nodeDynamics(fromField, toField, i0, j0, i1, j1, multiplier) {
    const transfer = (fromField[i1][j1] - fromField[i0][j0]) * multiplier
    toField[i0][j0] += transfer
    toField[i1][j1] -= transfer
}

function stepField(field, particles, cosmo) {
    const newField = field.map((col) => {
        return col.map((node) => node - cosmo)
    })
    for (let i = 0; i < field.length; i ++) {
        const minusI = mod(i - 1, field.length)
        const plusI = mod(i + 1, field.length)
        for (let j = 0; j < field[i].length; j ++) {
            const plusJ = mod(j + 1, field[i].length)
            nodeDynamics(field, newField, i, j, minusI, plusJ, CORNER_MULT)
            nodeDynamics(field, newField, i, j, i, plusJ, NEIGHBOR_MULT)
            nodeDynamics(field, newField, i, j, plusI, j, NEIGHBOR_MULT)
            nodeDynamics(field, newField, i, j, plusI, plusJ, CORNER_MULT)
        }
    }
    for (let particle of particles) {
        const x = Math.floor(particle.x)
        const y = Math.floor(particle.y)
        newField[x][y] += particle.mass
    }
    return newField
}

function stepParticles(particles, field) {
    for (let particle of particles) {
        let ddx = 0
        let ddy = 0
        for (let i = -1; i <= 1; i ++) {
            const modX = mod(Math.floor(particle.x + i), field.length)
            for (let j = -1; j <= 1; j ++) {
                const modY = mod(Math.floor(particle.y + j), field[modX].length)
                const distance = i * j === 0 ? 1 : Math.SQRT1_2
                const mult = field[modX][modY] * distance
                ddx += i * mult
                ddy += j * mult
            }
        }
        particle.dx += ddx * .01
        particle.dy += ddy * .01
        particle.x = mod(particle.x + particle.dx, field.length)
        particle.y = mod(particle.y + particle.dy, field[0].length)
    }

    for (let i = 0; i < particles.length; i ++) {
        const xi = Math.floor(particles[i].x)
        const yi = Math.floor(particles[i].y)
        for (let j = i + 1; j < particles.length; j ++) {
            const xj = Math.floor(particles[j].x)
            if (xi === xj && yi === Math.floor(particles[j].y)) {
                const mi = particles[i].mass
                const mj = particles[j].mass
                const mult = 1 / (mi + mj)
                particles[i] = {
                    x: (mi * particles[i].x + mj * particles[j].x) * mult,
                    y: (mi * particles[i].y + mj * particles[j].y) * mult,
                    dx: (mi * particles[i].dx + mj * particles[j].dx) * mult,
                    dy: (mi * particles[i].dy + mj * particles[j].dy) * mult,
                    mass: mi + mj
                }
                particles.splice(j, 1)
                j --
            }
        }
    }
}

export class ClassicalField {
    constructor(width, height, mass) {
        this._field = [ ]
        for (let i = 0; i < width; i ++) {
            this._field.push(Array(height).fill(0))
        }
   
        this._particles = [ ]
        for (let i = 0; i < mass; i ++) {
            this._particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                dx: 0,
                dy: 0,
                mass: 1
            })
        }

        this._cosmo = mass / (width * height)
    }

    step() {
        this._field = stepField(this._field, this._particles, this._cosmo)
        stepParticles(this._particles, this._field)
    }

    getDrawer() {
        return new FieldDrawer(this._field, this._particles)
    }
}