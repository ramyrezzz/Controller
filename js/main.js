/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

var startTimerDateObj;

var totalUsers;
var testStatus = 0;
var loadFromSession = 0;
var cookieName = "ControllerSessionID";

$(document).mouseup(function(e) {
    var container = $(".dropdown-menu");
    // If the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0)
        container.hide();
});

function activateDropDown(objId) {
    document.getElementById(objId).classList.toggle("show");
}

function reload() {
    location.reload()
}

/**
 * Responsible for Generating a unique Session ID !
 * @returns {string}
 */
function generateUUID() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function cookieHandler() {

    var cookieValue = getCookie(cookieName);
    console.log("Cookie is: " + cookieName + "-> " + cookieValue);
    if (cookieValue.length <= 16) {
        var sessionUUID = generateUUID();
        setCookie(cookieName, sessionUUID, 1)
    }

    setInterval(
        function () {

            if (!checkControllerData())
                return;

            // updateSession();
        },
    5000);
}

function setCookie(cname, cvalue, exdays) {
    var date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
}

function getCookie(cname) {
    var cookieAsString = "";
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieObject = decodedCookie.split(';');
    for(var i = 0; i <cookieObject.length; i++) {
        var cookieValue = cookieObject[i];
        while (cookieValue.charAt(0) == ' ') {
            cookieValue = cookieValue.substring(1);
        }
        if (cookieValue.indexOf(name) == 0) {
            cookieAsString = cookieValue.substring(name.length, cookieValue.length);
            return cookieAsString;
        }
    }
    return cookieAsString;
}

function buildBranchDeployDropdown(divname, list) {

    elementCount = document.getElementById(divname).childElementCount;
    if (elementCount >= 1) {
        $('#dropdown-menu2').show();
        return;
    }

    var newDiv = document.createElement('div');
    var html = '', i;
    $('#dropdown-menu2').show();
    if ($(divname).children().length > 0)
        return;

    for(i = 0; i < list.length; i++)
        html += '<a href=\"#\" class=\"dropdown-item\" onclick=\"deployBranch(\'' +  list[i].substring(7, list[i].length) + "\')\" id=\"" +  list[i] + '\"' + "<p> Deploy '<strong>" + list[i] + "</strong>" + '\' ' +  'branch' + '</p></a>' ;

    html += '</select>';
    newDiv.innerHTML = html;

    document.getElementById(divname).appendChild(newDiv);
}

function buildSessionSelectDropdown(divname, list) {

    elementCount = document.getElementById(divname).childElementCount;
    if (elementCount >= 1) {
        $('#selectSessionNavBarID').show();
        return;
    }

    // $('#selectSessionNavBarID').show();
    if ($(divname).children().length > 0)
        return;


    var newDiv = document.createElement('div');
    var html = '', i;
    for(i = 0; i < list.length; i++) {
        html += '<a class=\"navbar-item is-active\" onclick=\"getSessionByID(\'' + list[i].sessionID + "\')\"><strong>Select session :</strong>" + list[i].testNameID + '</a>' + '<button class="delete" style="float: right" onclick="clearSessionByID(list[i].sessionID)"></button>'
        // html += '<a href=\"#\" class=\"dropdown-item\" onclick=\"deployBranch(\'' +  list[i].substring(7, list[i].length) + "\')\" id=\"" +  list[i] + '\"' + "<p> Deploy '<strong>" + list[i] + "</strong>" + '\' ' +  'branch' + '</p></a>' ;
    }

    html += '</div>';
    newDiv.innerHTML = html;

    document.getElementById(divname).appendChild(newDiv);
}

function buildSelectProjectDropdown(divname, list) {

    elementCount = document.getElementById(divname).childElementCount;
    if (elementCount >= 1) {
        $('#dropdown-menu3').show();
        return;
    }

    var newDiv = document.createElement('div');
    var html = '', i;
    $('#dropdown-menu3').show();
    if ($(divname).children().length > 0)
        return;

    for(i = 0; i < list.length; i++)
        html += '<a href=\"#\" class=\"dropdown-item\" onclick=\"useSelectProject(\'' +  list[i] + "\')\" id=\"" +  list[i] + '\"' + "<p> Use '<strong>" + list[i].substring(14, list[i].length - 4) + "</strong>" + '\' ' +  'project' + '</p></a>' ;

    html += '</select>';
    newDiv.innerHTML= html;

    document.getElementById(divname).appendChild(newDiv);
}


function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}

function disableEnableInput(state) {
    if (document.getElementById("testNameID").disabled == state)
        return;
    document.getElementById("testNameID").disabled = state;
    document.getElementById("totalUsersID").disabled = state;
    document.getElementById("usersRateID").disabled = state;
}

function showHideDropdown(state) {
    if (document.getElementById('navBarMenuID').style.visibility == state)
        return;
    document.getElementById('navBarMenuID').style.visibility = state;
    document.getElementById('navBarParentID').style.visibility = state;
    document.getElementById('selectSessionNavLink').style.visibility = state;
    document.getElementById('selectSessionNavBarID').style.visibility = state;
}

function updateStartStopElement(element) {

    if (!checkControllerData())
        return;

    var text = element.innerText;
    if (text == 'START') {
        document.getElementById("timerID").innerHTML = "0h 0m 0s";
        testStatus = 1;
        element.innerText = 'STOP';
        element.className = "button is-danger is-active";
        document.getElementById('testRunningSpinnerID').style.visibility = "visible";
        document.getElementById('editTestConfigID').disabled = false;
        disableEnableInput(true);
        startTimer();
        updateSession();
        startTestAPIRequest();
        updatePauseResumeElement(document.getElementById('startButtonID'));
        return;
    }
    if (text == 'STOP'){
        testStatus = 0;
        loadFromSession = 0;
        element.innerText = 'START';
        element.className = "button is-primary is-inverted";
        document.getElementById('testRunningSpinnerID').style.visibility = "hidden";
        clearSessionByID(sessionID);
        showHideDropdown('visible');
        disableEnableInput(false);
        document.getElementById('editTestConfigID').disabled = true;
        forceStopAllContainers();
    }
}

function updatePauseResumeElement(element) {
    text = element.innerText;
    if (text == 'PAUSE') {
        element.innerText = 'RESUME';
        element.className = "button is-success is-hovered";
        testStatus = 2;
        updateSession();
        return;
    }
    element.innerText = 'PAUSE';
    element.className = "button is-warning is-active";
    testStatus = 1;
    updateSession();
}

function startTimer() {

    // Set the date we're counting down to
    var startTimerDate = startTimerDateObj;
    if (loadFromSession == 0) {
        startTimerDate = new Date().getTime();
        startTimerDateObj = startTimerDate;
    }

    // Update the count down every 1 second
    var timerLoop = setInterval(function() {

        if (testStatus == 0)
            clearInterval(timerLoop);

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = now - startTimerDate;
        console.log(distance)

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById('buttonisDockerView').focus();

        if (testStatus >= 1) {
            // Display the result in the element with id="timerID"
            document.getElementById("timerID").innerHTML = hours + "h "
                + minutes + "m " + seconds + "s ";
        }
    }, 1000);
}

function close_window() {
    window.close();
}

function checkControllerData() {

    usersRateInput = document.getElementById("usersRateID").value;
    totalUsers = document.getElementById("totalUsersID").value;
    testNameID = document.getElementById("testNameID").value;

    if (totalUsers == '')
        return false;
    if (usersRateInput == '')
        return false;
    if (testNameID == '')
        return false;
    // if (projectID == '')
    //     return false;
    return true
}

function showTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";

    if (tabName == 'mainControllerID') {
        document.getElementById('testScenarioID').style.visibility = "visible";
        return;
    }
    document.getElementById('testScenarioID').style.visibility = "hidden";
    if (testStatus == 0) {
        document.getElementById('editTestConfigID').disabled = true;
    }
}

function applySessionDetails(sessionDetails) {

    loadFromSession = 1;

    document.getElementById("usersRateID").value = sessionDetails.usersRateInput;
    document.getElementById("totalUsersID").value = sessionDetails.totalUsers;
    document.getElementById("testNameID").value = sessionDetails.testNameID;
    startTimerDateObj = sessionDetails.startTimerDateObj;
    testStatus = sessionDetails.testStatus;
    projectID = sessionDetails.projectID;


    updateStartStopElement(document.getElementById('startButtonID'));
    showHideDropdown('hidden');
    disableEnableInput(true);
}

function useSelectProject (projectPath) {
    projectID = projectPath;
    $('#dropdown-menu3').hide();

}
