
$(document).ready(function() {
    var id = $('span#_id').attr('value');
    var human_id = $('span#human_id').attr('value');
   if (mouse != null) {
        mouse.plot(id, '/mouse/chart', {'node': 'div#mouse-chart'});
    }
    /*
    if (bodymap != null) {
        var bodymap_node = $('<div />', {
            id: 'bodymap-chart',
            class: 'chart'
        }).appendTo('div#content-wrapper');

        bodymap.plot(human_id, '/human/chart/bodymap', {'node': 'div#bodymap-chart'});
    }
*/
    if (bodymap != null) {
        bodydonut.plot(human_id, '/human/chart/bodymap', {'node': 'div#bodydonut-chart'});
    }
    if (brainspan != null) {
        brainspan.plot(human_id, '/human/chart/brainspan', {'node': 'div#brainspan-chart',
                                                            'width': 100});
    }
});
