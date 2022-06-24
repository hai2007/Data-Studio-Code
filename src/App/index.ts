import { Component, ref, mountComponent } from 'nefbl'
import { isFunction, isString } from '@hai2007/tool/type'

import style from './index.scss'
import template from './index.html'

import lazyLoad from '../dialogs/lazy-load.js'

@Component({
    template,
    styles: [style]
})
export default class {

    view: any

    $setup() {
        return {

            // 记录当前选中的图层
            currentIndex: ref(-1),

            // 记录当前大屏内容
            view: ref({
                value: {
                    name: "大屏编辑器"
                }
            })
        }
    }

    useGraph(graph) {

        let graphInstance = globalThis[graph.name]

        if (isFunction(graphInstance)) {

            // 先准备好挂载点
            let el = document.createElement('div')
            document.getElementById('container').appendChild(el)

            // 然后对挂载点进行初始化
            el.style.position = 'absolute'
            el.style.left = graph.position.left + "%"
            el.style.top = graph.position.top + "%"
            el.style.width = graph.position.width + "%"
            el.style.height = graph.position.height + "%"

            // 最后调用绘制
            graphInstance(el, graph.config, {
                echarts: globalThis.echarts,
                image2D: globalThis.image2D
            })
        } else {
            alert('非常抱歉，由于插件[' + graph.name + ']未正确安装，此次运行被中断，请安装此插件~')
        }

    }

    // 加载图表插件
    loadGraph(graph) {
        let head = document.getElementsByTagName('head')[0]
        let script = document.createElement('script')

        let host = window.location.host
        if (/^127\.0\.0\.1/.test(host) || /^localhost/.test(host)) {
            script.src = "/@file" + graph.url + "/index.js"
        } else {
            script.src = "file://" + graph.url + "/index.js"
        }
        head.appendChild(script)
    }

    useLayer() {
        // target就表示新打开的弹框对象，你可以通过此来调用弹框的方法等实现数据传递
        this.openDialog('layer').then((target: any) => {
            target.component.init({
                el: target.el
            })
        })
    }

    useTemplate() {
        this.openDialog('template').then((target: any) => {
            target.component.init({
                el: target.el
            })
        })
    }

    openDialog(dialogName) {

        return new Promise((resolve, reject) => {
            lazyLoad[dialogName]().then((data => {
                let li = document.createElement('li')
                li.style.position = 'fixed'
                li.style.left = '0'
                li.style.top = '0'
                li.style.background = '#a081815c'
                li.style.width = '100vw'
                li.style.height = '100vh'
                document.getElementById('dialog').appendChild(li)
                resolve({
                    component: mountComponent(li, data.default, this['_module']),
                    el: li
                })
            }))
        })
    }

    $mounted() {

        // 调整显示位置大小
        globalThis.doResize()

        // 通知主线程页面加载完毕
        globalThis.nodeRequire('electron').ipcRenderer.send("view-ready")

        // 启动事件监听主进程
        globalThis.nodeRequire('electron').ipcRenderer

            // 文件 / 安装
            .on("install-graph", (event, graph) => {
                this.loadGraph(graph)
            })

            // 文件 / 打开
            .on("open-view", (event, view) => {
                this.view = view

                for (let index = 0; index < view.value.graphs.length; index++) {
                    this.useGraph(view.value.graphs[index])
                }

            })

            // 运行 / 打包
            .on("run-pkg", (event) => {
                globalThis.nodeRequire('electron').ipcRenderer.send("run-pkg", this.view)
            })

    }

}
