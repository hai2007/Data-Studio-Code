const { ipcMain } = require('electron');
const fs = require('fs');
const { fullPath } = require('./rootFolder');
const { etcpack_pkg } = require('etcpack');
const CommonjsPlug = require('@etcpack/commonjs-plug');
const { selectFolder } = require('./dialog');
const nodejs = require('@hai2007/nodejs');

module.exports = function (win) {

    ipcMain.on('view-ready', function () {

        // 加载已经注册的图表
        let graphsJSONPath = fullPath('./graphs/index.json');
        let graphsJSON = JSON.parse(fs.readFileSync(graphsJSONPath));
        for (let graphName in graphsJSON.graphs) {
            win.webContents.send("install-graph", graphsJSON.graphs[graphName]);
        }

    });

    ipcMain.on('run-pkg', function (event, view) {

        let indexCode = fs.readFileSync(fullPath('./index.js'));

        let graphsImport = "";
        let graphsKey = "";
        for (let index = 0; index < view.value.graphs.length; index++) {
            let graphName = view.value.graphs[index].name;

            graphsImport += "import " + graphName + " from '../graphs/" + graphName + "/index.js';\n";
            graphsKey += "'" + graphName + "':" + graphName + ",";

        }

        graphsKey = graphsKey.replace(/\,$/, '');

        fs.writeFileSync(fullPath('./etcpack/index.js'), `

        ${graphsImport}
        
         var graphs={${graphsKey}};
         var viewJSON=${JSON.stringify(view, null, 2)};

         ${indexCode}
         `, 'utf-8');

        etcpack_pkg({
            mode: "production",
            entry: fullPath('./etcpack/index.js'),
            output: fullPath('./etcpack/build/main.js'),
            plug: [new CommonjsPlug()]
        });

        selectFolder().then(data => {

            if (!data.canceled) {

                let targetFolder = nodejs.fullPath("dscode-" + new Date().valueOf(), data.filePaths[0]);
                fs.mkdirSync(targetFolder);

                nodejs.copySync(fullPath('./etcpack/build'), nodejs.fullPath('./build', targetFolder));
                nodejs.copySync(fullPath('./etcpack/index.html'), nodejs.fullPath('index.html', targetFolder));

            }

        });

    });

};
