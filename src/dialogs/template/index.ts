import { Component, ref } from 'nefbl'
import xhtml from '@hai2007/browser/xhtml'

import style from './index.scss'
import template from './index.html'

@Component({
    template,
    styles: [style]
})
export default class {

    el: any

    $setup() {
        return {
            el: ref(null),
        }
    }

    init(init: any) {
        this.el = init.el
    }

    close() {
        xhtml.remove(this.el)
    }

}
