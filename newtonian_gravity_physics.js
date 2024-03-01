import { lSubtract, lMagnitude2, deepClone, replicate } from './util.js'

export function generate(dimensions, quantity) {
    const particles = replicate(quantity, () => ({
        position: dimensions.map((dim) => (Math.random() - .5) * dim),
        velocity: dimensions.map(() => Math.random() - .5),
        mass: 1
    }))

    return { particles }
}

export function step(data) {
    const response = deepClone(data)
    newtonianGravities(response)
    move(response)
    collisions(response)
    return response
}

function newtonianGravities({ particles }) {
    for (let i = 0; i < particles.length; i ++)
        for (let j = i + 1; j < particles.length; j ++)
            newtonianGravity(particles[i], particles[j])
}

function newtonianGravity(part1, part2) {
    const delta = lSubtract(part2.position, part1.position)
    const distance2 = lMagnitude2(delta)
    const multiplier = Math.pow(distance2, -1.5)
    const multI = multiplier * part2.mass
    part1.velocity = part1.velocity.map((v, k) => v + delta[k] * multI)
    const multJ = multiplier * part1.mass
    part2.velocity = part2.velocity.map((v, k) => v - delta[k] * multJ)
}

function move({ particles }) {
    for (const particle of particles)
        particle.position = particle.position.map((p, i) => p + particle.velocity[i])
}

function collisions(data) {
    for (let i = 0; i < data.particles.length; i ++) {
        let partI = data.particles[i]
        let radiusI = Math.cbrt(partI.mass)
        for (let j = i + 1; j < data.particles.length; j ++) {
            const partJ = data.particles[j]
            const distance2 = lMagnitude2(lSubtract(partJ.position, partI.position))
            const radiusTot = radiusI + Math.cbrt(partJ.mass)
            if (distance2 < radiusTot * radiusTot) {
                collide(partI, partJ)
                radiusI = Math.cbrt(partI.mass)
                data.particles.splice(j, 1)
                data.green = data.green == null ? null : data.green !== j ? data.green - (data.green > j ? 1 : 0) : i
                data.red = data.red == null ? null : data.red !== j ? data.red - (data.red > j ? 1 : 0) : data.green !== i ? i : null
                j --
            }
        }
    }
}

function collide(part1, part2) {
    const mass = part1.mass + part2.mass
    part1.position = part1.position.map((p, k) => {
        return ((part1.mass * p) + (part2.mass * part2.position[k])) / mass
    })
    part1.velocity = part1.velocity.map((v, k) => {
        return ((part1.mass * v) + (part2.mass * part2.velocity[k])) / mass
    })
    part1.mass = mass
}
