function fireAPICall(hostNameAPI) {
    var rsp = '{"rami" : 1}';
    $.ajax({
        url: hostNameAPI,
        type: 'GET',
        data: {
            format: 'json'
        },
        success: function(response) {
            rsp = JSON.stringify(response);
            $('#responseTextField').attr('placeholder', rsp);
            //console.log(response)
        },
        error: function() {
            //console.log("error")
        }
    });

    $('#dropdown-menu2').show();
}

function clearFunction() {
    if ($('#responseTextField').attr('placeholder') == '') {
        $('#responseTextField').attr('placeholder', 'Label is empty already');
        return;
    }

    $('#dropdown-menu2').hide();
    $('#responseTextField').attr('placeholder', 'Response will be printed here');
}