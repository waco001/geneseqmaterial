$(document).ready(function() {
  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();
  $('.LiveSearch').keyup(function() {
    $('.searchResult').empty();
    if($(this).val().length >= 3){
      delay(function(){
        getData = {};
        getData['query'] = $('.LiveSearch').val();
        getData['api'] = true;
        $.ajax({
          type: "GET",
          url: "/search",
          data: getData,
          cache: false,
          success: function(d)
          {
            var items = [];
            var data = JSON.parse(d);
            $.each( data, function( key, val ) {
              items.push('<a href="/gene?id=' + val["_id"] + '" class="list-group-item"><span class="badge">' + parseFloat(val['expression']).toFixed(2) +'</span><h4 class="list-group-item-heading">'+ val['human_name'] +'</h4><p class="list-group-item-text">'+ val['cell'] +'</p></a>');
            });
            $('.searchResult').append( items.join('') );
          }
        });
      }, 1000 );
    }
  });
});
