import { el, updateSize } from './util.js'

export default class EndlessForms extends HTMLElement {
    connectedCallback() {
        this.canvas = el('canvas', { style: 'width: 100%; height: 100%;' })
        this.canvas.addEventListener('click', (e) => this.handleClick(e))
        this.attachShadow({ mode: 'closed' }).append(this.canvas)

        this.paused = this.paused != undefined ? this.paused : true
        if (this.config == undefined)
            this.defaultConfig()
        if (this.data == undefined)
            this.generate()
        this.display()

        setInterval(() => {
            if (this.paused)
                return

            this.step()
            this.display()
        }, 16)

        new ResizeObserver(() => {
            updateSize(this.canvas)
            this.display()
        }).observe(this);
    }

    pause() {
        this.paused = true
    }

    play() {
        this.paused = false
    }

    reset() {
        this.generate()
        this.display()
    }

    setConfig(config) {
        this.config = config
    }

    getData() {
        return JSON.stringify({ data: this.data, config: this.config })
    }

    setData(text) {
        const { data, config } = JSON.parse(text)
        this.data = data
        this.setConfig(config)
        this.display()
    }

    handleClick() {
        this.clickHandler()
        this.display()
    }
    clickHandler() { }

    display() {
        this.canvas.getContext('2d').drawImage(this.getCanvas(), 0, 0)
    }
}
