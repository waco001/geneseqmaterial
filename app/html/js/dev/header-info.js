function headerInfo(){
    $( ".header-info" ).each(function( index ) {
        $(this).detach().appendTo('#headerInfo').show();
    });
}
