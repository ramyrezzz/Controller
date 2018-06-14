var rate = 0;
var users = 1;
var totalUsers = 1;
var branch = "";
var statusResponse;

function fireAPICall(endPoint) {

    $('#responseTextField').val("");

    format = 'jsonp';
    hostName = 'http://163.172.129.226:5005/' + endPoint;
    usersRateInput = document.getElementById("usersRateID").value;
    totalUsers = document.getElementById("totalUsersID").value;

    if (endPoint.includes('updateVusers'))
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

function getBranchList() {

    $('#responseTextField').val("");

    format = 'jsonp';
    hostName = 'http://163.172.129.226:5005/branches';

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
            showDropDown(rsp);
            $('#responseTextField').click();

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
            console.log("Request SUCCESS");
            $('#responseTextField').val(response);
            window.reload();
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}

function updateSession() {
    $('#responseTextField').val("");

    format = 'jsonp';
    hostName = 'http://163.172.129.226:5005/updateSession';
    sessionID = getCookie(cookieName);
    _id = sessionID;
    usersRateInput = document.getElementById("usersRateID").value;
    totalUsers = document.getElementById("totalUsersID").value;
    testNameID = document.getElementById("testNameID").value;
    // projectID = document.getElementById("projectNameID").value;
    projectID = 'hardcodedProjectJMX.jmx';

    $.ajax({
        url: hostName,
        type: 'POST',
        accept: 'application/json',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
            sessionID,
            _id,
            usersRateInput,
            totalUsers,
            testNameID,
            startTimerDateObj,
            projectID,
            testStatus
        },
        success: function(response) {
            console.log("Request SUCCESS");
            let rsp = JSON.stringify(response, undefined, 4);
            $('#responseTextField').val(rsp);
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}

function clearAllSessions() {
    sessionID = "";
    clearSessionByID();
    sessionID = getCookie(cookieName);
}

function clearSessionByID() {
    $('#responseTextField').val("");

    format = 'jsonp';
    hostName = 'http://163.172.129.226:5005/clearSessionByID';
    $.ajax({
        url: hostName,
        type: 'GET',
        accept: 'application/json',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
            sessionID
        },
        success: function(response) {
            console.log("Request SUCCESS");
            let rsp = JSON.stringify(response, undefined, 4);
            $('#responseTextField').val(rsp);
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}

function getStats() {

    setInterval(function () {
        format = 'jsonp';
        hostName = 'http://163.172.129.226:5005/stats';
        $.ajax({
            url: hostName,
            type: 'GET',
            accept: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            success: function(response) {
                console.log("Request SUCCESS");

                memObject = response.memv;
                memFree = memObject.memFree;
                memUsed = memObject.memUsed;
                memoryTotal = memObject.memoryTotal;
                cpuValue = response.cpu;

                document.getElementById("tMemID").innerHTML = "  " + memoryTotal + " MB";
                document.getElementById("fMemID").innerHTML = "  " + memFree + " MB";
                document.getElementById("uMemID").innerHTML = "  " + memUsed + " MB";
                document.getElementById("cpuUsageID").innerHTML = "  " + cpuValue + " %";
            },
            error: function() {
                console.log("Request FAIL");
            }
        });
    }, 5000);
}

function rampUpContianer(type) {

    var endpoint = 'containerUp'
    if (type == 'stop')
        endpoint = 'containerDown'

    var numberOfContainers = document.getElementById("containerNoId").value;
    var prefixContName = 'jmeter-standalone0'

    $('#responseTextField').val("");

    console.log(numberOfContainers)
    for (let i = 0; i <  numberOfContainers; i++) {

        containerName = prefixContName + (i + 1);

        hostName = 'http://163.172.129.226:5005/' + endpoint;
        $.ajax({
            url: hostName,
            type: 'GET',
            accept: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                containerName
            },
            success: function(response) {
                console.log("Request SUCCESS");
                let rsp = JSON.stringify(response, undefined, 4);
                $('#responseTextField').val(rsp);
            },
            error: function(response) {
                console.log("Request FAIL");
                $('#responseTextField').val(response);
            }
        });
    }

}


function showDropDown(response) {
    listObj = JSON.parse(response).branchList;
    buildBranchDeployDropdown('select-Branch', listObj);
}

function showpROJECTSDropDown(response) {

    listObj = JSON.parse(response).projects;
    buildSelectProjectDropdown('select-Project', listObj)
}

function clearResponseFunction() {

    if ($('#responseTextField').attr('placeholder') == '') {
        $('#responseTextField').val('Label is empty already');
        return;
    }

    $('#dropdown-menu2').hide();
    $('#responseTextField').val('Response will be printed here');
}
