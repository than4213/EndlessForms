import { lSubtract, lMagnitude2 } from './util.js'

export const clickHandlers = {
    NewtonianGravity({ clientX, clientY, target }, { particles, red, green }) {
        const clickPos = [ clientX - target.width * .5, clientY - target.height * .5 ]
        const { index } = particles.reduce((res, { position }, ind) => {
            const thisDist = lMagnitude2(lSubtract(clickPos, position))
            return thisDist < res.d2 ? { index: ind, d2: thisDist } : res
        }, { d2: Number.MAX_SAFE_INTEGER })
        red = red === index ? null : green == null || green === index ? red : index
        green = green === index ? null : green == null ? index : green
        return { particles, red, green }
    }
}
