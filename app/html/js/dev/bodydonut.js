/**
* @overview Draws bodydonut for bodymap expression.
* @module Bodymap
* @author Abhishek Gorti
*/
/**
* Manages the bodymap donut chart
* @this bodymap namespace
* @class bodymap
* @constructor
*/
var bodydonut = new function() {
    var draw_plot = function(id, source, params) {
        $.post(source, {
            'gene_id': id
        }, function(data, status) {
            if (status == 'success' && data != null) {
                $('#two').addClass("mdl-cell--4-col");
                $('#two').append('<div class="donut-card mdl-card mdl-shadow--2dp"></div>');
                var bodydonut_node = $('<div />', {
                    id: 'bodydonut-chart',
                    class: 'chart'
                }).appendTo('div.donut-card');
                data = jQuery.parseJSON(data);
                self.data = data;
                data.values.sort(function(a, b) {
                    return b[1] - a[1]
                });
                console.log(data);
                var dataset = [{
                    gene: "",
                    data: []
                }];
                var genes = [];
                dataset = [{
                    data: [],
                    gene: "LPAR"
                }];
                var displayData = [];
                data.values.forEach(function(s) {
                    genes.push(s[0]);
                    dataset[0].data.push(s[1])
                });

                var texttip = d3.select(".texttip");

                var width = 450,
                height = 800/3,
                cwidth = 50;
                var inner_radius = 70;

                var color = d3.scale.category20();
                var pie = d3.layout.pie()
                .sort(null)
                .startAngle(70 * (Math.PI / 180))
                .endAngle(370 * (Math.PI / 180));

                var arc = d3.svg.arc().innerRadius(inner_radius).outerRadius(cwidth * (1) + inner_radius);

                var svg = d3.select("#bodydonut-chart").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("stroke-width", "5")
                .attr("stroke", "white")
                .append("g")
                .attr("transform", "translate(" + (inner_radius+cwidth) + "," + (inner_radius+cwidth+25) + ")");

                var gs = svg.selectAll("g")
                .data(d3.values(dataset)).enter().append("g");
                gs.selectAll("path").data(function(d) {
                    return pie(d.data);
                })
                .enter().append("path")
                .attr("fill", function(d, i) {
                    return color(i);
                })
                .attr("d", arc)
                .each(function(d, i, j) {
                    if(d.endAngle-d.startAngle >= .4){
                        displayData.push({'name' : genes[i], 'value' : Math.round(d.data), 'color' : color(i)});
                    }
                })
                .on("mouseover", function(d, i, j) {
                    d3.select(this)
                    .attr("stroke","white")
                    .transition()
                    .duration(500)
                    .attr("stroke-width",0);
                    d3.select(".inside-text").text(genes[i] + " " + Math.round(d.value));
                }).on("mouseout", function() {
                    d3.select(this)
                    .attr("stroke","white")
                    .transition()
                    .duration(500)
                    .attr("stroke-width","2.5");
                    d3.select(".inside-text").text("");
                }).on("click", function(d, j) {
                    alert("Onclick Maybe?:" + d.data.name);
                });

                var texts = svg.selectAll("text")
                .data(d3.values(dataset))
                .enter();
                svg.append("text")
                .attr("stroke", "black")
                .attr("stroke-width", "0")
                .style("text-anchor", "middle")
                .attr("class", "inside-text")
                .text(function(d) {
                    return '';
                });
                svg.append('text')
                .attr('class', 'title')
                .attr('x', 0)
                .attr('y', -(inner_radius+cwidth)-5)
                .attr("stroke", "black")
                .attr("stroke-width", ".2")
                .attr('text-anchor', 'middle')
                .text(data.title);

                for(var i=0;i < displayData.length; i++){
                    var text = svg.append('text')
                    .attr('x', width/2.5)
                    .attr('y', (-height/2 + 30*i))
                    .attr("fill", displayData[i].color)
                    .attr("stroke-width", "0")
                    .attr('text-anchor', 'middle')
                    .text(displayData[i].name + ": " + displayData[i].value);

                }
            }
        });
    };
    /**
    * Public function to draw plot
    * @param {string} id - gene id to plot
    * @param {string} source - data source to POST to
    * @param {dict} params
    */
    this.plot = function(id, source, params) {
        draw_plot(id, source, params);
    };
}
