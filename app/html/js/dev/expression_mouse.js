/**
 * @overview Mouse celltype expression.
 * @module Mouse
 * @author Michael Laraia
 */

/**
 * Manages the mouse celltype expression chart
 * @this - mouse namespace
 * @class Mouse
 * @constructor
*/
var mouse = new function() {
    var self = this;

    var width = 400;
    var height = 400;

    var margin = {};
    margin.left = 200;
    margin.right = 0;
    margin.top = 45;
    margin.bottom = 0;

    // var max_width = 600;
    var default_radius = 3;
    //
    // /**
    //  * Gets width for svg
    //  * @return {int} width of svg
    //  */
    // var get_width = function() {
    //     var width = $(window).width();
    //     if (width > max_width) return max_width;
    //     else return width;
    // };
    //
    // /**
    //  * Gets height for plot
    //  * @param {int} width - width of the plot
    //  * @return {int} height of plot
    //  */
    // var get_height = function(width) {
    //     return 400;
    // };

    /**
     * Draws creates plot
     * @param {string} id - gene id to plot
     * @param {string} source data source to POST to
     * @param {dict} params JSON object containing height, widht, and radius
     */
    var draw_plot = function(id, source, params) {
        var width = params.width;
        var height = params.height;
        var radius = params.radius;

        var colorscale;

        var xscale = d3.scale.ordinal();
        var yscale = d3.scale.linear();

        var yaxis = d3.svg.axis()
            .scale(yscale)
            .orient('top')
            .innerTickSize(-width)
            .outerTickSize(0)
            .ticks(5);
        var xaxis = d3.svg.axis()
            .scale(xscale)
            .orient('left')
            .innerTickSize(-height)
            .outerTickSize(0);

        var done = false;
        $.post(source, {'gene_id': id}, function(data, status) {
            if (status == 'success' && data != null) {
                $('#one').addClass("mdl-cell--8-col");
                $('#one').append('<div class="celltype-card mdl-card mdl-shadow--2dp"></div>');
                var mouse_node = $('<div />', {
                    id: 'mouse-chart',
                    class: 'chart'
                }).appendTo('div.celltype-card');
                //console.log('data: ' + data);
                //console.log('status: ' + status);

                data = jQuery.parseJSON(data);
                self.data = data;
                margin.bottom = 10 + data.axis_length * 5;
                xscale.domain(data.names)
                      .rangePoints([0 + 1, width*.5]);
                yscale.domain([data.min - 1, data.max*1.1])
                      .range([0, height]);
                //console.log(data.names);

                if (data.colors.length <= 10) {
                    colorscale = d3.scale.category10();
                } else {
                    colorscale = d3.scale.category20();
                }
                colorscale.domain(data.colors);
                //console.log(data.colors);
                var svg;
                if (params.node != null) svg = d3.select(params.node);
                else svg = d3.select('div#content-wrapper');
                width = $(params.node).width();
                height = width / 2.76;
                svg = svg.append('svg')
                    .attr('width', width - 30)
                    .attr('height', height);
                svg.append('rect')
                    .attr('width', width - 30)
                    .attr('height', height )
                    .attr('fill', '#DDD');
                var canvas = svg
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                canvas.append('g')
                    .attr('class', 'axis')
                    .call(xaxis)
                    .selectAll('text')
                    .attr('x', '-1em')
                    .attr('y', '0em')
                    .attr('transform', 'rotate(0)');

                canvas.append('g')
                    .attr('class', 'axis')
                    .call(yaxis)
                    .selectAll('text')
                    .attr('x', '1em');

                canvas.selectAll('circle')
                    .data(data.values)
                    .enter()
                    .append('circle')
                    .attr('cy', function(d) {
                        return xscale(d[0]);
                    })
                    .attr('cx', function(d) {
                        return yscale(d[3]);
                    })
                    .attr('fill', function(d) {
                        return colorscale(d[2]);
                    })
                    .attr('r', radius);

                canvas.append('text')
                    .attr('class', 'title')
                    .attr('x', (height / 2.5))
                    .attr('y', - (margin.top / 2))
                    .attr('text-anchor', 'middle')
                    .text(data.title);
            }
            done = true;
        });


    };

    /**
     * Public function to draw plot
     * @param {string} id - gene id to plot
     * @param {string} source - data source to POST to
     * @param {dict} params
     *
     */
    this.plot = function(id, source, params) {
        //console.log(params);
        if (params.width == null) params.width = width;
        if (params.height == null) params.height = height;
        if (params.radius == null) params.radius = default_radius;

        draw_plot(id, source, params);
    };
}
