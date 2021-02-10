import { generateObjects } from './generate.js'
import { step } from './physics.js'
import { canvas2D } from './canvas.js'

function el(name, attributes, children) {
    const response = document.createElement(name)
    if (attributes)
        for (const attribute in attributes)
            response.setAttribute(attribute, attributes[attribute])
    if (children)
        response.append(...children)
    return response
}

function pausedStyles(toggle, config) {
    toggle.style.clip = 'rect(35px, 95px, 85px, 45px)'
    toggle.style.left = '-45px'
    config.style.display = 'inline-block'
}

function playStyles(toggle, config) {
    toggle.style.clip = 'rect(35px, 145px, 85px, 95px)'
    toggle.style.left = '-95px'
    config.style.display = 'none'
}

class EndlessForms extends HTMLElement {
    connectedCallback() {
        const canvas = el('canvas',
            { style: 'width: 100%; height: 100%; z-index: -1;' })
        const toggle = el('img',
            { src: './controls.png', width: '240px', height: '120px',
                style: 'position: absolute; top: -35px;' })
        const dataText = el('textarea', { rows: 4, cols: 50 })
        const config = el('div', { style: 'background-color: white;' }, [ dataText ])
        playStyles(toggle, config)
        this.attachShadow({ mode: 'closed' }).append(canvas, toggle, config)

        let paused = false
        let data = generateObjects([ canvas.clientWidth, canvas.clientHeight ])
        const ctx = canvas.getContext('2d')
        setInterval(() => {
            if (canvas.width !== canvas.clientWidth)
                canvas.width = canvas.clientWidth
            if (canvas.height !== canvas.clientHeight)
                canvas.height = canvas.clientHeight
            if (paused)
                return
            data = step(data)
            const buffer = canvas2D(data, canvas.width, canvas.height)
            ctx.drawImage(buffer, 0, 0)
        }, 16)
        
        toggle.addEventListener("click", () => {
            paused = !paused
            if (paused) {
                pausedStyles(toggle, config)
                dataText.value = JSON.stringify(data)
            } else {
                playStyles(toggle, config)
                data = JSON.parse(dataText.value)
            }
        })
    }
}
customElements.define('endless-forms', EndlessForms);