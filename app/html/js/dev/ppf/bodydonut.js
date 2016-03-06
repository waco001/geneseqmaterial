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
        $.post(source, {'gene_id': id}, function(data, status) {
            if (status == 'success' && data != null) {
                console.log('data: ' + data);
                console.log('status: ' + status);

                data = jQuery.parseJSON(data);
                self.data = data;


                var dataset = [
                {gene:"LPAR",data : [10,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,14]}
                ];
                var genes = ["thyroid","testis","ovary","leukocyte","skeletal","muscle","prostate","lymph","node","lung","adipose","adrenal","brain","breast","colon","kidney","heart","liver", "difference"
                ];
                genes = [];
                dataset = [{data:[], gene:"LPAR"}];
                data.values.forEach(function(s){
                    genes.push(s[0]);
                    dataset[0].data.push(s[1])
                });
                var width = 600,
                    height = 400,
                    cwidth = 50;
                var inner_radius = 70;

                var color = d3.scale.ordinal()
                .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#FFFFFF"]);

                var pie = d3.layout.pie()
                    .sort(null)
                    .startAngle(0 * (Math.PI / 180))
                    .endAngle(280 * (Math.PI / 180));

                var arc = d3.svg.arc();

                var svg = d3.select("#bodydonut-chart").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("stroke-width", "2.5")
                    .attr("stroke", "white")
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var gs = svg.selectAll("g")
                .data(d3.values(dataset)).enter().append("g");
                gs.selectAll("path").data(function(d) {
                        return pie(d.data);
                    })
                    .enter().append("path")
                    .attr("fill", function(d, i) {
                        return color(i);
                    })
                    .attr("d", function(d, i, j) {
                        return arc.innerRadius(cwidth * j + inner_radius).outerRadius(cwidth * (j + 1) + inner_radius)(d)
                    });

                var texts = svg.selectAll("text")
                                .data(d3.values(dataset))
                                .enter();
                texts.append("text")
                .attr("dy",function(d,i){
                                    return "-" + ((inner_radius + 10) + cwidth*i)
                                })
                    .attr("dx", "-10")
                    .attr("stroke","black")
                    .attr("stroke-width","0")
                    .style("text-anchor", "end")
                    .attr("class", "inside")
                    .text(function(d,i){
                                    return id;
                                })
                svg.append("text")
                    .attr("stroke","black")
                    .attr("stroke-width","0")
                    .style("text-anchor", "middle")
                    .attr("class", "inside")
                    .text(function(d) { return ''; });

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
