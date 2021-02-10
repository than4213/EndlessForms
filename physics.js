export function step(data) {
    return collide(move(gravity(data)))
}

export function gravity(data) {
    const response = data.map((d) => ({ ...d }))
    for (let i = 0; i < response.length; i ++) {
        const objI = response[i]
        for (let j = i + 1; j < response.length; j ++) {
            const objJ = response[j]
            const { delta, distance2 } = getDistance2(objI.position, objJ.position);
            const multiplier = Math.pow(distance2, -1.5)
            const multI = multiplier * objJ.mass
            objI.velocity = objI.velocity.map((v, k) => v + delta[k] * multI)
            const multJ = multiplier * objI.mass
            objJ.velocity = objJ.velocity.map((v, k) => v - delta[k] * multJ)
        }
    }
    return response
}

export function move(data) {
    return data.map(({ position, velocity, mass }) => {
        return { velocity, mass,
            position: position.map((p, i) => p + velocity[i])
        }
    })
}

export function collide(data) {
    const response = [ ...data ]
    for (let i = 0; i < response.length; i ++) {
        let objI = response[i]
        let radiusI = Math.cbrt(objI.mass)
        for (let j = i + 1; j < response.length; j ++) {
            const objJ = response[j]
            const { distance2 } = getDistance2(objI.position, objJ.position);
            const radiusTot = radiusI + Math.cbrt(objJ.mass)
            if (distance2 < radiusTot * radiusTot) {
                const mass = objI.mass + objJ.mass
                const position = objI.position.map((p, k) => {
                    return ((objI.mass * p) + (objJ.mass * objJ.position[k])) / mass
                })
                const velocity = objI.velocity.map((v, k) => {
                    return ((objI.mass * v) + (objJ.mass * objJ.velocity[k])) / mass
                })
                objI = { position, velocity, mass }
                radiusI = Math.cbrt(objI.mass)
                response[i] = objI
                response.splice(j, 1)
                j --
            }
        }
    }
    return response
}

export function getDistance2(position1, position2) {
    const delta = position1.map((p1, i) => position2[i] - p1)
    const distance2 = delta.reduce((dis, del) => dis + del * del, 0)
    return { delta, distance2 }
}
