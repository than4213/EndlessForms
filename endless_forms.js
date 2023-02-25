import { el, updateSize } from './util.js'

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

export default class EndlessForms extends HTMLElement {
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
        let data = this.generate([ canvas.clientWidth, canvas.clientHeight ])
        setInterval(() => {
            updateSize(canvas)
            if (!paused) {
                const response = this.simulate(data, canvas.width, canvas.height)
                data = response.data
                canvas.getContext('2d').drawImage(response.canvas, 0, 0)
            }
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

        canvas.addEventListener('click', (e) => {
            data = this.clickHandler(e, data)
        })
    }

    clickHandler() { }
}
