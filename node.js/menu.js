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
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                win.close();
            }
        }]
    }, {
        label: "文件",
        submenu: [{
            label: "打开",
            accelerator: 'CmdOrCtrl+o',
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
            accelerator: 'CmdOrCtrl+s',
            click: function () {
                win.webContents.send("save-view");
            }
        }, {
            type: 'separator'
        }, {
            label: '安装',
            accelerator: 'CmdOrCtrl+i',
            click: () => {

                selectFolder().then(data => {

                    if (!data.canceled) {

                        for (let index = 0; index < data.filePaths.length; index++) {

                            let filePath = data.filePaths[index];
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

                    }

                });

            }
        }, {
            type: 'separator'
        }, {
            label: "打包发布",
            accelerator: 'CmdOrCtrl+x',
            click: function () {
                win.webContents.send("run-pkg");
            }
        }]
    }, {
        label: '编辑',
        submenu: [{
            label: '撤销',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
        }, {
            label: '重做',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
        }, {
            type: 'separator'
        }, {
            label: '剪切',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
        }, {
            label: '复制',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        }, {
            label: '粘贴',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        }, {
            label: '全选',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
        }]
    }, {
        label: "视图",
        submenu: [{
            label: "刷新",
            accelerator: 'CmdOrCtrl+r',
            click: function () {
                win.webContents.reload();
            }
        }, {
            label: "硬刷新",
            accelerator: 'Shift+CmdOrCtrl+r',
            click: function () {
                win.webContents.reload(true);
            }
        }, {
            type: 'separator'
        }, {
            label: "打开调试工具",
            accelerator: 'f12',
            click: function () {
                win.webContents.openDevTools();
            }
        }]
    }]));

};
