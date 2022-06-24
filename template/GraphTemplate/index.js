var GraphTemplate = function (el, config, obj) {

    
    el.innerHTML="<h2>温馨提示</h2><hr /><div>如果你看见这段文字，说明启动成功！</div>";

};

if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = GraphTemplate;
} else {
    window.GraphTemplate = GraphTemplate;
}