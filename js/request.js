function fireAPICall(hostNameAPI) {

    var type = 'GET';
    if (hostNameAPI.endsWith("/deployContainer")) {
        type = 'POST';
    }

    $.ajax({
        url: hostNameAPI,
        type: type,
        data: {
            format: 'jsonp'
        },
        success: function(response) {
            console.log("success");
            rsp = JSON.stringify('{"cpu": 0.2}');
            $('#responseTextField').val(rsp);
        },
        error: function() {
            console.log("error");
        }
    });
    $('#dropdown-menu2').hide();
}

function prepareCall(hostName, buttonID) {

    var x = fireAPICall(hostName);
    $(buttonID).attr('placeholder', x);
    $(buttonID).hide();
}

function clearFunction() {
    if ($('#responseTextField').attr('placeholder') == '') {
        $('#responseTextField').attr('placeholder', 'Label is empty already');
        return;
    }

    $('#dropdown-menu2').hide();
    $('#responseTextField').attr('placeholder', 'Response will be printed here');
}