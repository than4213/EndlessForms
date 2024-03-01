import { forNeighbors, map2D, replicate } from './util.js'

const CELL_WIDTH = 100
const CELL_HEIGHT = 50
const FORCE_MULT = .1

export function generate() {
    return {
        cells: replicate(CELL_WIDTH, () => replicate(CELL_HEIGHT, () => ({ p: (Math.random() - .5) * .2, v: 0 }))),
        cycle: 0,
        results: replicate(CELL_WIDTH, () => 0)
    }
}

export function step(force, wavelength, amplitude, cells, cycle, results) {
    cells = map2D(cells, ({ p, v }, i, j) => {
        v = v + forNeighbors(cells, i, j, (neighbor) => neighbor.p - p) * force
        return { p: p + v, v }
    })

    const sourceP = ((cycle % (wavelength * 2 + 1))/wavelength - 1) * amplitude
    const bottom = cells[0].length - 1
    cells[34][bottom].p = sourceP
    cells[35][bottom].p = sourceP
    cells[36][bottom].p = sourceP
    cells[63][bottom].p = sourceP
    cells[64][bottom].p = sourceP
    cells[65][bottom].p = sourceP

    results = results.map((result, i) => {
        if (Math.abs(cells[i][0].p) < 1)
            return result

        cells[i][0].p += cells[i][0].p < 0 ? 1 : -1
        return result + 1
    })

    cycle ++
    return { cells, cycle, results }
}
