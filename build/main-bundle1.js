
/*************************** [bundle] ****************************/
// Original file:./src/dialogs/layer/index.ts
/*****************************************************************/
window.__etcpack__bundleSrc__['21']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    var _dec, _class2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

__etcpack__scope_args__=window.__etcpack__getBundle('1');
var Component=__etcpack__scope_args__.Component;
var ref=__etcpack__scope_args__.ref;

__etcpack__scope_args__=window.__etcpack__getBundle('17');
var xhtml =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('26');
var style =__etcpack__scope_args__.default;

__etcpack__scope_args__=window.__etcpack__getBundle('27');
var template =__etcpack__scope_args__.default;


var doback = function doback(layer) {};

var _class = (_dec = Component({
  template: template,
  styles: [style]
}), _dec(_class2 = /*#__PURE__*/function () {
  function _class2() {
    _classCallCheck(this, _class2);

    _defineProperty(this, "el", void 0);
  }

  _createClass(_class2, [{
    key: "$setup",
    value: function $setup() {
      return {
        el: ref(null)
      };
    }
  }, {
    key: "init",
    value: function init(_init) {
      var _this = this;

      this.el = _init.el;
      doback = _init.doback;
      var targetEl = document.getElementById('dialogs@layer');

      var _loop = function _loop(index) {
        var itemEl = document.createElement('div');
        itemEl.setAttribute('class', 'item');
        itemEl.innerHTML = "<span></span>\n                ".concat(globalThis.graphs[index]);
        targetEl.appendChild(itemEl);
        xhtml.bind(itemEl, 'click', function () {
          doback({
            "position": {
              "left": 0,
              "top": 0,
              "width": 100,
              "height": 100
            },
            "name": globalThis.graphs[index],
            "config": {}
          });

          _this.close();
        });
      };

      for (var index = 0; index < globalThis.graphs.length; index++) {
        _loop(index);
      }
    }
  }, {
    key: "close",
    value: function close() {
      xhtml.remove(this.el);
    }
  }]);

  return _class2;
}()) || _class2);

__etcpack__scope_bundle__.default=_class;
  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/dialogs/layer/index.scss
/*****************************************************************/
window.__etcpack__bundleSrc__['26']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= "\n .view{\n\nwidth: 700px;\n\nheight: 500px;\n\nposition: fixed;\n\nleft: calc(50vw - 350px);\n\ntop: calc(50vh - 250px);\n\nbackground-color: white;\n\n}\n\n .view>h2{\n\nbackground-color: rgb(0, 0, 0);\n\nline-height: 50px;\n\ncolor: white;\n\ntext-align: center;\n\ncursor: move;\n\n}\n\n .view>div.content{\n\nheight: 400px;\n\noverflow: auto;\n\n}\n\n .view>div.btns{\n\nline-height: 50px;\n\ntext-align: center;\n\n}\n\n .view>div.btns>button{\n\noutline: none;\n\nborder: none;\n\nmargin: 0 10px;\n\npadding: 5px 10px;\n\ncolor: white;\n\ncursor: pointer;\n\nbackground-color: rgb(80, 74, 74);\n\n}\n"
  
    return __etcpack__scope_bundle__;
}

/*************************** [bundle] ****************************/
// Original file:./src/dialogs/layer/index.html
/*****************************************************************/
window.__etcpack__bundleSrc__['27']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    __etcpack__scope_bundle__.default= "<div class=\"view\">\n    <h2 ui-dragdrop>\n        新增图表\n    </h2>\n    <div class=\"content layer\" id=\"dialogs@layer\"></div>\n    <div class=\"btns\">\n        <button ui-on:click=\"close\">取消</button>\n    </div>\n</div>\n"
  
    return __etcpack__scope_bundle__;
}
