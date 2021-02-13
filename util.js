export function el(name, attributes, children) {
    const response = document.createElement(name)
    if (attributes)
        for (const attribute in attributes)
            response.setAttribute(attribute, attributes[attribute])
    if (children)
        response.append(...children)
    return response
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
