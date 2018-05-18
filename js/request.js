var rate = 1;
var users = 1;
var totalUsers = 1;
var branch = "";
var testStatus = 0;

function fireAPICall(endPoint) {

    $('#responseTextField').val("");

    format = 'jsonp';
    hostName = 'http://163.172.129.226:5005/' + endPoint;
    usersRateInput = document.getElementById("usersRateID").value;
    totalUsers = document.getElementById("totalUsersID").value;

    if (endPoint.includes('updateVusers') && usersInput != '')
        users = usersInput;
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
            usersRateInput,
            testStatus,
            totalUsers
        },
        success: function(response) {
            console.log("Request success");
            let rsp = JSON.stringify(response, undefined, 4);
            $('#responseTextField').val(rsp);
            if (endPoint == 'branches') {
                showDropDown(rsp);
                $('#responseTextField').click();
            }

            return rsp;
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}


function getProjects() {

    $('#responseTextField').val("");

    format = 'jsonp';
    hostName = 'http://163.172.129.226:5005/projects';

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
        },
        success: function(response) {
            console.log("Request success");
            let rsp = JSON.stringify(response, undefined, 4);
            $('#responseTextField').val(rsp);
            showpROJECTSDropDown(rsp);
            $('#responseTextField').click();

            return rsp;
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}

function deployBranch(branchName) {

    $('#responseTextField').val("");

    format = 'jsonp';
    hostName = 'http://163.172.129.226:5005/deployContainer';

    $.ajax({
        url: hostName,
        type: 'GET',
        accept: 'application/json',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
            branchName
        },
        success: function(response) {
            window.reload();
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}

function showDropDown(response) {
    listObj = JSON.parse(response).branchList;
    buildDivForDropDown('select-Branch', listObj);
}

function showpROJECTSDropDown(response) {
    listObj = JSON.parse(response).projects;
    buildDivForDropDown('select-Project', listObj)
}

function clearFunction() {
    if ($('#responseTextField').attr('placeholder') == '') {
        $('#responseTextField').val('Label is empty already');
        return;
    }

    $('#dropdown-menu2').hide();
    $('#responseTextField').val('Response will be printed here');
}