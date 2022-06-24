const os = require('os');
const fs = require('fs');
const nodejs = require('@hai2007/nodejs');

let rootFolder = nodejs.fullPath("./dscode", os.homedir());

exports.initRootFolder = function () {

    // 如果根文件夹不存在
    if (!fs.existsSync(rootFolder)) {
        nodejs.copySync(nodejs.fullPath('../rootFolder', __dirname), rootFolder);
    }

};

exports.fullPath = function (param) {
    return nodejs.fullPath(param, rootFolder);
};