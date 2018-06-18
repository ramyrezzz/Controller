

function getBranchList() {

    $('#responseTextField').val("");

    format   = 'jsonp';
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

    format   = 'jsonp';
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

function deployBranch(branch) {

    $('#responseTextField').val("");

    format   = 'jsonp';
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
            branch
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

    format    = 'jsonp';
    hostName  = 'http://163.172.129.226:5005/updateSession';
    sessionID = getCookie(cookieName);
    _id       = sessionID;

    if (!checkControllerData())
        return;

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
            // projectID,
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
    clearSessionByID(sessionID);
    sessionID = getCookie(cookieName);
    if(sessionID)
        reload();
}

function clearSessionByID(sessionID) {

    $('#responseTextField').val("");

    format   = 'jsonp';
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


function forceStopAllContainers() {
    $('#responseTextField').val("");

    format   = 'jsonp';
    hostName = 'http://163.172.129.226:5005/forceContainersDown';
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
        format   = 'jsonp';
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

                document.getElementById("tMemID").innerHTML = "  " + memoryTotal;
                document.getElementById("fMemID").innerHTML = "  " + memFree;
                document.getElementById("uMemID").innerHTML = "  " + memUsed;
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
    var prefixContName     = 'other-test-0'

    $('#responseTextField').val("");

    if (isNaN(numberOfContainers) || numberOfContainers == '')
        numberOfContainers = 1;

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
                containerName,
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
}

function getAllSessions() {
    $('#responseTextField').val("");

    format   = 'jsonp';
    hostName = 'http://163.172.129.226:5005/getSessionList';
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
            let rsp = JSON.stringify(response, undefined, 4);
            $('#responseTextField').val(rsp);
            buildSessionSelectDropdown('selectSessionNavBarID', response);
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}

function getSessionByID(sessionID) {
    $('#responseTextField').val("");

    format   = 'jsonp';
    hostName = 'http://163.172.129.226:5005/getSession';
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
            applySessionDetails(response);
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}

function startTestAPIRequest() {
    $('#responseTextField').val("");

    var activeThreads = 200;
    var sessionID = getCookie(cookieName);

    format   = 'jsonp';
    hostName = 'http://163.172.129.226:5005/evaluateRampup';
    $.ajax({
        url: hostName,
        type: 'GET',
        accept: 'application/json',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
            activeThreads,
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
