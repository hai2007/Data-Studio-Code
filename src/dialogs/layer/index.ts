import { Component, ref } from 'nefbl'
import xhtml from '@hai2007/browser/xhtml'

import style from './index.scss'
import template from './index.html'

let doback = (layer: any) => { }

@Component({
    template,
    styles: [style]
})
export default class {

    el: any

    $setup() {
        return {
            el: ref(null)
        }
    }

    init(init: any) {
        this.el = init.el
        doback = init.doback

        let targetEl = document.getElementById('dialogs@layer')
        for (let index = 0; index < globalThis.graphs.length; index++) {

            let itemEl = document.createElement('div')

            itemEl.setAttribute('class', 'item')
            itemEl.innerHTML = `<span></span>
                ${globalThis.graphs[index]}`

            targetEl.appendChild(itemEl)

            xhtml.bind(itemEl, 'click', () => {
                doback({
                    "position": {
                        "left": 0,
                        "top": 0,
                        "width": 100,
                        "height": 100
                    },
                    "name": globalThis.graphs[index],
                    "config": {}
                })

                this.close()
            })
        }

    }

    close() {
        xhtml.remove(this.el)
    }

}
