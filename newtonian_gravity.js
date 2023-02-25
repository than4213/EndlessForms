import EndlessForms from './endless_forms.js'
import { replicate } from './util.js'

export class NewtonianGravity extends EndlessForms {
    generate(dimensions) {
        const QUANTITY = 1000

        const particles = replicate(QUANTITY, () => ({
            position: dimensions.map((dim) => (Math.random() - .5) * dim),
            velocity: dimensions.map(() => Math.random() - .5),
            mass: 1
        }))

        return { particles }
    }
}
customElements.define('newtonian-gravity', NewtonianGravity);
