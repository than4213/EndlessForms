import { replicate } from './util.js'

export const generators = {
    Field2D(width, height) {
        const TARGET_CELLS = 1000000

        const scale = Math.ceil(Math.sqrt(width * height / TARGET_CELLS))
        const xLength = Math.ceil(width / scale)
        const yLength = Math.ceil(height / scale)
        field = replicate(xLength, () => replicate(yLength, () => [ 0, 0 ]))

        return { ...this.Particles([ width, height ]), field }
    },
}
