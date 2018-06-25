/**
 * All the requests implemented in the current application are available here
 *
 * TODO: Create a wrapper that is responsible for generating the needed request : avoid code duplication and redundancy.
 */

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
            showpROJECTSDropDown(response);
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
            projectID,
            totalUsers,
            testNameID,
            testStatus,
            usersRateInput,
            maxContainerUsers,
            startTimerDateObj
        },
        success: function(response) {
            // console.log("Request SUCCESS");
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
                parsedMemoryObject = response.memv;

                memoryTotal = parsedMemoryObject.memoryTotal;
                memFree     = parsedMemoryObject.memFree;
                memUsed     = parsedMemoryObject.memUsed;
                cpuValue    = response.cpu;

                document.getElementById("cpuUsageID").innerHTML = "  " + cpuValue + " %";
                document.getElementById("tMemID").innerHTML = "  " + memoryTotal;
                document.getElementById("fMemID").innerHTML = "  " + memFree;
                document.getElementById("uMemID").innerHTML = "  " + memUsed;
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

    var sessionID = getCookie(cookieName);
    var activeThreads = maxContainerUsers

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
            sessionID,
            activeThreads
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

function getInfluxStatus() {

    hostName  = 'http://163.172.129.226:8086/query?pretty=true';
    db = "jmeter";
    q = "select distinct(suite) from (select rate,suite from total where time > now()-40s)";

    $.ajax({
        url: hostName,
        type: 'POST',
        accept: 'application/json',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
            db,
            q
        },
        success: function(response) {
            console.log("Request SUCCESS");
            let rsp = JSON.stringify(response, undefined, 4);
            $('#responseTextField').val(rsp);
            buildContainerList(response);
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}

function getContainerInfoByID(sessionID) {
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
            addContainerDownState(response);
            $('#responseTextField').val(rsp);
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}


function applyCustomRepo(element) {

    $('#responseTextField').val("");
    var gitRepoUrl = document.getElementById('importGitRepoID').value
    var branchName = 'master'

    format   = 'jsonp';
    hostName = 'http://163.172.129.226:5005/checkoutRepo';
    $.ajax({
        url: hostName,
        type: 'GET',
        accept: 'application/json',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
            gitRepoUrl,
            branchName
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

function uploadFile() {
    console.log("File Uploaded here !")
    $('#responseTextField').val("");
    hostName = 'http://163.172.129.226:5005/upload';
    var form_data = new FormData($('#upload-file')[0]);
    $.ajax({
        type: 'POST',
        url: hostName,
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        async: false,
        success: function(response) {
            console.log("Request SUCCESS");
            let rsp = JSON.stringify(response, undefined, 4);
            document.getElementById("inputFileID").value = "";
            if (response.fileName != undefined)
                document.getElementById("uploadTitleID").innerText = response.fileName + " Uploaded OK";
            else
                document.getElementById("uploadTitleID").innerText = "Uploaded Failed";

            $('#responseTextField').val(rsp);
        },
        error: function(response) {
            console.log("Request FAIL");
            $('#responseTextField').val(response);
        }
    });
}


function getContainerHealth() {
    healthLoop = setInterval(function () {
        getContainerInfoByID(sessionID);
        sleep(500);
        getInfluxStatus();
        if (testStatus == 0)
            clearInterval(healthLoop);
    }, 30 * 1000)
}

function showDropDown(response) {
    listObj = JSON.parse(response).branchList;
    buildBranchDeployDropdown('select-Branch', listObj);
}

function showpROJECTSDropDown(response) {
    var listObj = response.results;
    var projects = listObj.projects;
    buildSelectProjectDropdown('select-Project', projects);
}

function clearResponseFunction() {

    if ($('#responseTextField').attr('placeholder') == '') {
        $('#responseTextField').val('Label is empty already');
        return;
    }

    $('#dropdown-menu2').hide();
    $('#responseTextField').val('Response will be printed here');
}
