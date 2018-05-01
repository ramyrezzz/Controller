function fireAPICall(endPoint, branch, rate = '1', users = '1') {

    $('#responseTextField').val("");

    format = 'jsonp';
    hostName = 'http://163.172.129.226:5005/' + endPoint;
    usersInput = document.getElementById("vUsersID").value;

    if (endPoint.includes('updateVusers') && usersInput != '') {
        users = usersInput;
    }

    usersRateInput = document.getElementById('usersPerSecondID').value;
    if (usersRateInput != '') {
        rate = usersRateInput;
    }

    if (branch == '')
        branch = 'accesa';

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
            branch,
            users,
            rate
        },
        success: function(response) {
            console.log("Request success");
            let rsp = JSON.stringify(response, undefined, 4);
            $('#responseTextField').val(rsp);
            if (endPoint == 'branches') {
                showDropDown(rsp);
                $('#responseTextField').click();
            }
            if (endPoint.includes('deploy')) {
                window.reload();
            }
            return rsp;
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
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