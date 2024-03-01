export function el(name, attributes, children) {
    const response = document.createElement(name)
    if (attributes)
        for (const attribute in attributes)
            response.setAttribute(attribute, attributes[attribute])
    if (children)
        response.append(...children)
    return response
}

export function text(txt) {
    return document.createTextNode(txt)
}

export function updateSize(canvas) {
    if (canvas.width !== canvas.clientWidth)
        canvas.width = canvas.clientWidth
    if (canvas.height !== canvas.clientHeight)
        canvas.height = canvas.clientHeight
}

export function replicate(size, callback) {
    const response = new Array(size)
    for (let i = 0; i < size; i ++) {
        response[i] = callback(i)
    }
    return response
}

export function lSubtract(vector1, vector2) {
    return vector1.map((v1, i) => v1 - vector2[i])
}

export function lMagnitude2(vector) {
    return vector.reduce((mag, v) => mag + v * v, 0)
}

export function deepClone(data) {
    const response = data
    if (Array.isArray(data)) {
        return data.map((d) => deepClone(d))
    } else if (data && typeof data === 'object') {
        const response = { }
        for (const key in data)
            response[key] = deepClone(data[key])
    }
    return response
}

export function forNeighbors(data, indI, indJ, callback) {
    const lowI = Math.max(0, indI - 1)
    const highI = Math.min(data.length - 1, indI + 1)
    const lowJ = Math.max(0, indJ - 1)
    const highJ = Math.min(data[0].length - 1, indJ + 1)
    let response = 0
    for (let i = lowI; i <= highI; i ++) {
        for (let j = lowJ; j <= highJ; j ++) {
            if (i == indI && j == indJ)
                continue
            response += callback(data[i][j]) * (i == indI || j == indJ ? 1 : Math.SQRT1_2)
        }
    }
    return response
}

export function map2D(data, callback) {
    return data.map((row, i) => row.map((cell, j) => callback(cell, i, j)))
}
