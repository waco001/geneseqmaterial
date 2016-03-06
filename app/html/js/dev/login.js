$(function() {
    var snackbarContainer = document.querySelector('#auth-toast');
    $( "#login-form" ).submit(function( event ) {
        event.preventDefault();
        var sendData = { method : 'login',
                user : $( "#login_username" ).val(),
                _pass : $( "#login_password" ).val()};
        $.ajax({
            url: "/login",
            method: "POST",
            data: sendData,
            dataType: "html"
        }).done(function( msg ) {
            var input = JSON.parse(msg);
            var snackbar = "asdasd";
            if(input['success'] == true){
                snackbar = "Login Succesful. redirecting to Home.";
                setTimeout(function(){window.location.replace("/")}, 2000);
            }else{
                snackbar = input['invalid'];
            }
            snackbarContainer.MaterialSnackbar.showSnackbar({message: snackbar});
        });
    });
});
