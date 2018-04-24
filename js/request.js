function fireAPICall(endPoint, branch) {

    $('#responseTextField').val("");

    format = 'jsonp';
    hostName = 'http://163.172.129.226:5005/' + endPoint;

    if (endPoint.includes('deploy') && branch == '')
        branch = document.getElementById("branchID").value;

    if (branch == '')
        branch = 'master';

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
            let rsp = JSON.stringify(response);
            $('#responseTextField').val(rsp);
            if (endPoint == 'branches') {
                showDropDown(rsp);
            }
            if (endPoint.includes('deploy')) {
                window.reload();
            }
            return rsp;
        },
        error: function(response) {
            console.log("Request FAIL");
            let rsp = alert(JSON.stringify(response));
            // rsp = JSON.stringify(response);
            $('#responseTextField').val(rsp);
        }
    });
}

function showDropDown(response) {
    listObj = JSON.parse(response).branchList;
    buildDivForBranch('select-Branch', listObj);
}

function deployFunction(branchName) {
    fireAPICall('deployContainer', branchName);
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