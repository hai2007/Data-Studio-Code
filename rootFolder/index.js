
var rootEl = document.getElementById('root');

var i, graph, el;
for (i = 0; i < viewJSON.value.graphs.length; i++) {
    graph = viewJSON.value.graphs[i];

    el = document.createElement('div');
    rootEl.appendChild(el);

    el.style.position = 'absolute';
    el.style.left = graph.position.left + "%";
    el.style.top = graph.position.top + "%";
    el.style.width = graph.position.width + "%";
    el.style.height = graph.position.height + "%";

    graphs[graph.name](el, graph.config, {
        echarts: window.echarts,
        image2D: window.image2D
    })

}
