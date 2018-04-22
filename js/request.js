function fireAPICall(endPoint) {

    $('#responseTextField').val("");

    format = 'jsonp';
    branch = 'master';
    hostName = 'http://163.172.129.226:5005/' + endPoint;
    console.log(endPoint);

    if (endPoint.includes('deploy'))
        branch = document.getElementById("branchID").value;

    $.ajax({
        url: hostName,
        type: 'GET',
        accept: 'application/json',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
            format,
            branch
        },
        success: function(response) {
            console.log("Request success");
            rsp = JSON.stringify(response);
            $('#responseTextField').val(rsp);
        },
        error: function(response) {
            console.log("Request FAIL");
            rsp = JSON.stringify(response);
            $('#responseTextField').val(rsp);
        }
    });
    $('#dropdown-menu2').hide();
}

function clearFunction() {
    if ($('#responseTextField').attr('placeholder') == '') {
        $('#responseTextField').val('Label is empty already');
        return;
    }

    $('#dropdown-menu2').hide();
    $('#responseTextField').val('Response will be printed here');
}