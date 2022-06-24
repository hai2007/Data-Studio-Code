// https://www.electronjs.org/zh/docs/latest/api/dialog

const { dialog } = require('electron');

exports.selectFolder = function () {
    return dialog.showOpenDialog({
        properties: ['openDirectory']
    })
}