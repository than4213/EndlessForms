export function step(data) {
    return collisions(move(newtonianGravity(data)))
}

export function newtonianGravity(data) {
    const response = data.map((d) => ({ ...d }))
    for (let i = 0; i < response.length; i ++)
        for (let j = i + 1; j < response.length; j ++)
            mutateNewtonianGravity(response[i], response[j])
    return response
}

export function move(data) {
    return data.map(({ position, velocity, mass }) => {
        return { velocity, mass,
            position: position.map((p, i) => p + velocity[i])
        }
    })
}

export function collisions(data) {
    const response = [ ...data ]
    for (let i = 0; i < response.length; i ++) {
        let partI = response[i]
        let radiusI = Math.cbrt(partI.mass)
        for (let j = i + 1; j < response.length; j ++) {
            const partJ = response[j]
            const { distance2 } = getDistance2(partI.position, partJ.position);
            const radiusTot = radiusI + Math.cbrt(partJ.mass)
            if (distance2 < radiusTot * radiusTot) {
                partI = collide(partI, partJ)
                radiusI = Math.cbrt(partI.mass)
                response[i] = partI
                response.splice(j, 1)
                j --
            }
        }
    }
    return response
}

export function collide(part1, part2) {
    const mass = part1.mass + part2.mass
    const position = part1.position.map((p, k) => {
        return ((part1.mass * p) + (part2.mass * part2.position[k])) / mass
    })
    const velocity = part1.velocity.map((v, k) => {
        return ((part1.mass * v) + (part2.mass * part2.velocity[k])) / mass
    })
    return { position, velocity, mass }
}

export function getDistance2(position1, position2) {
    const delta = position1.map((p1, i) => position2[i] - p1)
    const distance2 = delta.reduce((dis, del) => dis + del * del, 0)
    return { delta, distance2 }
}

function mutateNewtonianGravity(part1, part2) {
    const { delta, distance2 } = getDistance2(part1.position, part2.position);
    const multiplier = Math.pow(distance2, -1.5)
    const multI = multiplier * part2.mass
    part1.velocity = part1.velocity.map((v, k) => v + delta[k] * multI)
    const multJ = multiplier * part1.mass
    part2.velocity = part2.velocity.map((v, k) => v - delta[k] * multJ)
}
