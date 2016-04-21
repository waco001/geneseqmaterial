$( document ).ready(function() {
    urlParam = function(name,ref){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(ref);
        if (results==null){
            return null;
        }
        else{
            return results[1] || 0;
        }
    }
    window.isPreLoaded = false;
    page('/', index);
    page('/table', table);
    page('/gene', gene);
    page('/explore', explore);
    page({hashbang:true});

    function _loadPage(ref){
        $('#headerInfo').html("");
        if(window.isPreLoaded == true){
            //console.log("PAC");
        }else{
            //console.log("NP");
            window.isPreLoaded = true;
            $.get( "/mouse/table", function( data ) {
                window._PreLoadTable = data;
            });
            $.get( "/explore", function( data ) {
                window._PreLoadExplore = data;
            });
            $.get( "/js/armstrong/geneData.json", function( data ) {
                window._PreLoadExploreGeneData = data;
            });
            $.get( "/js/armstrong/treeData.json", function( data ) {
                window._PreLoadExploreTreeData = data;
            });
            //console.log("PC");

        }
        var ret = $('#content').hide().load(ref);
        $('#content').fadeIn("slow");
        console.log("Manually Loaded: " + ref);
        return ret;
    }
    function index() {
        _loadPage('/front/index.html');
    }
    function table() {
        if(window.isPreLoaded == true){
            $('#content').html(window._PreLoadTable);
        }else{
            _loadPage('/mouse/table');
        }
    }
    function explore() {
        if(window.isPreLoaded == true){
            $('#content').html(window._PreLoadExplore);
            console.log("PreLoaded");
        }else{
            _loadPage('/explore');
        }
    }
    function gene(id) {
        _loadPage('/mouse/gene?id='+urlParam('id',id['canonicalPath']));
    }
    //window.location.href


});
