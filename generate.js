export function generateObjects(dimensions) {
    const QUANTITY = 1000

    return replicate(QUANTITY, () => ({
        position: dimensions.map((dim) => (Math.random() - .5) * dim),
        velocity: dimensions.map(() => Math.random() - .5),
        mass: 1
    }))
}

export function field2d(width, height) {
    const TARGET_CELLS = 1000000

    const scale = Math.ceil(Math.sqrt(width * height / TARGET_CELLS))
    const xLength = Math.ceil(width / scale)
    const yLength = Math.ceil(height / scale)
    field = replicate(xLength, () => replicate(yLength, () => [ 0, 0 ]))

    return { field, objects: generateObjects([ width, height ])}
}

export function replicate(size, callback) {
    const response = new Array(size)
    for (let i = 0; i < size; i ++) {
        response[i] = callback(i)
    }
    return response
}
