import { Component, ref } from 'nefbl'
import { isFunction } from "@hai2007/tool/type"

import urlFormat from '../tool/urlFormat'

import style from './index.scss'
import template from './index.html'

import pages from '../pages/lazy-load'

@Component({
    selector: "app-root",
    template,
    styles: [style]
})
export default class {
    currentPage: any
    currentName: any

    $setup() {
        return {
            currentPage: ref(null),
            currentName: ref("")
        }
    }

    $mounted() {

        // 地址栏信息
        let urlObj = urlFormat(window.location.href)

        // 获取当前页面
        let page = pages[urlObj.router[0]]

        // 如果页面不存在
        if (!isFunction(page)) {

            // 地址错误，跳转到首页
            page = pages['home']
            this.currentName = "home"
        }

        // 否则
        else {
            this.currentName = urlObj.router[0]
        }

        // 打开页面
        page().then(data => {
            this.currentPage = data.default
        })

    }

    changeNav(event) {
        this.currentName = event.target.getAttribute('tag')
        window.location.href = "#/" + this.currentName
        pages[this.currentName]().then(data => {
            this.currentPage = data.default
        })
    }

}
