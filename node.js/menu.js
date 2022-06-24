const { Menu } = require('electron');
const { selectFolder } = require('./dialog');
const nodejs = require('@hai2007/nodejs');
const { fullPath } = require('./rootFolder');
const fs = require('fs');

module.exports = function (win) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([{
        label: '大屏编辑器',
        submenu: [{
            label: "关于",
            click: function () {
                console.log('>>>关于>>>');
            }
        }, {
            label: "更新...",
            click: function () {
                console.log('>>>更新>>>');
            }
        }, {
            type: 'separator'
        }, {
            label: '关闭',
            accelerator: 'Command+Q',
            click: () => {
                win.close();
            }
        }]
    }, {
        label: "文件",
        submenu: [{
            label: "新建",
            accelerator: 'Command+n',
            click: function () {
                console.log('>>>新建>>>');
            }
        }, {
            label: "打开",
            accelerator: 'Command+o',
            click: function () {

                selectFolder().then(data => {

                    if (!data.canceled) {

                        let filePath = data.filePaths[0] + "/index.json";
                        let viewJson = JSON.parse(fs.readFileSync(filePath));

                        win.webContents.send("open-view", {
                            value: viewJson,
                            path: filePath
                        });
                    }

                });


            }
        }, {
            label: "保存",
            accelerator: 'Command+s',
            click: function () {
                console.log('>>>保存>>>');
            }
        }, {
            type: 'separator'
        }, {
            label: '安装',
            accelerator: 'Command+i',
            click: () => {

                selectFolder().then(data => {

                    if (!data.canceled) {

                        let filePath = data.filePaths[0];
                        let folderName = filePath.replace(/\\/g, '/').replace(/\/$/, '').split('/').pop();
                        let targetPath = fullPath('./graphs/' + folderName);

                        // 统一复制到指定地方保存起来
                        nodejs.copySync(filePath, targetPath);

                        let graphsJSONPath = fullPath('./graphs/index.json');

                        // 登记

                        let graphsJSON = JSON.parse(fs.readFileSync(graphsJSONPath));
                        let graph = {
                            name: folderName,
                            url: targetPath
                        };

                        graphsJSON.graphs[folderName] = graph;

                        fs.writeFileSync(graphsJSONPath, JSON.stringify(graphsJSON, null, 2), 'utf-8');

                        // 通知渲染界面加载
                        win.webContents.send("install-graph", graph);

                    }

                });

            }
        }]
    }, {
        label: "运行",
        submenu: [{
            label: "打包",
            accelerator: 'Command+x',
            click: function () {
                win.webContents.send("run-pkg");
            }
        }]
    }, {
        label: "工具",
        submenu: [{
            label: "打开调试工具",
            accelerator: 'f12',
            click: function () {
                win.webContents.openDevTools();
            }
        }]
    }, {
        label: "视图",
        submenu: [{
            label: "刷新",
            accelerator: 'Command+r',
            click: function () {
                win.webContents.reload();
            }
        }, {
            label: "硬刷新",
            accelerator: 'Shift+Command++r',
            click: function () {
                win.webContents.reload(true);
            }
        }]
    }]));

};
