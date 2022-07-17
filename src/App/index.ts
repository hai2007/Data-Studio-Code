import { Component, ref, mountComponent } from 'nefbl'
import { isFunction } from '@hai2007/tool/type'
import xhtml from '@hai2007/browser/xhtml'

import style from './index.scss'
import template from './index.html'

import lazyLoad from '../dialogs/lazy-load.js'

@Component({
    template,
    styles: [style]
})
export default class {

    view: any
    currentIndex: any

    $setup() {
        return {

            // 记录当前选中的图层
            currentIndex: ref(-1),

            // 记录当前大屏内容
            view: ref({
                value: {
                    name: "大屏编辑器",
                    graphs: []
                }
            })
        }
    }

    useGraph(graph, index) {

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
                Clunch: globalThis.Clunch,
                addStyle: function (source) {
                    let styleElement = document.createElement('style');
                    let head = document.head || document.getElementsByTagName('head')[0];
                    styleElement.innerHTML = source;
                    styleElement.setAttribute('type', 'text/css');
                    head.appendChild(styleElement);
                }
            })

            let layerEl = document.createElement('li')
            document.getElementById('layer-container').appendChild(layerEl)

            layerEl.innerHTML = `<span></span>${graph.name}`

            xhtml.bind(layerEl, 'click', () => {
                this.currentIndex = index
            })

        } else {
            alert('非常抱歉，由于插件[' + graph.name + ']未正确安装，此次运行被中断，请安装此插件~')
        }

    }

    showViewConfig() {
        this.currentIndex = -1
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

        // 登记
        globalThis.graphs.push(graph.name)

    }

    // 选中图层（弹框）
    useLayer() {
        let _this = this

        // target就表示新打开的弹框对象，你可以通过此来调用弹框的方法等实现数据传递
        this.openDialog('layer').then((target: any) => {
            target.component.init({
                el: target.el,
                doback(layer) {
                    _this.view.value.graphs.push(layer)
                    _this.useGraph(layer, _this.view.value.graphs.length - 1)
                }
            })
        })
    }

    // 选中模板（弹框）
    useTemplate() {
        this.openDialog('template').then((target: any) => {
            target.component.init({
                el: target.el
            })
        })
    }

    // 打开弹框
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

    // 应用view
    runTemplate(view?) {

        if (view) {
            this.view = view
            sessionStorage.setItem('dscode@view-template', JSON.stringify(view))
        }

        for (let index = 0; index < this.view.value.graphs.length; index++) {
            this.useGraph(this.view.value.graphs[index], index)
        }
    }

    $mounted() {
        globalThis.graphs = []

        setTimeout(() => {
            let viewTemplateJSON = sessionStorage.getItem('dscode@view-template')
            this.runTemplate(viewTemplateJSON ? JSON.parse(viewTemplateJSON) : null)
        }, 1000)

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
                this.runTemplate(view)
            })

            // 运行 / 打包
            .on("run-pkg", (event) => {
                globalThis.nodeRequire('electron').ipcRenderer.send("run-pkg", this.view)
            })

    }

}
