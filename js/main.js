/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

var startTimerDateObj;
var selectedProjectPath;

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
    startTimerDateObj = "0";

    var cookieValue = getCookie(cookieName);
    console.log("Cookie is: " + cookieName + "-> " + cookieValue);
    if (cookieValue.length <= 16) {
        var sessionUUID = generateUUID();
        setCookie(cookieName, sessionUUID, 1)
    }

    setInterval(
        function () {
            // Update the
        },
    5000);
}

function setCookie(cname, cvalue, exdays) {
    console.log(cname + " " + cvalue);
    var date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    console.log(expires, true);
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
    if (elementCount > 1) {
        $('#dropdown-menu2').show();
        return;
    }
    var newDiv = document.createElement('div');
    var html = '', i;
    $('#dropdown-menu2').show();
    if ($(divname).children().length > 0)
        return;

    for(i = 0; i < list.length; i++)
        html += '<a href=\"#\" class=\"dropdown-item\" onclick=\"deployBranch(\'' +  list[i] + "\')\" id=\"" +  list[i] + '\"' + "<p> Deploy '<strong>" + list[i] + "</strong>" + '\' ' +  'branch' + '</p></a>' ;

    html += '</select>';
    newDiv.innerHTML= html;

    document.getElementById(divname).appendChild(newDiv);
}

function buildSelectProjectDropdown(divname, list) {

    elementCount = document.getElementById(divname).childElementCount;
    if (elementCount > 1) {
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

function updateStartStopElement(element) {
    var text = element.innerText;
    if (text == 'START') {
        document.getElementById("timerID").innerHTML = "0h 0m 0s";
        testStatus = 1;
        element.innerText = 'STOP';
        element.className = "button is-danger is-active";
        document.getElementById('testStateId').style.visibility = "visible";
        startTimer();
        updateSession();
        return;
    }
    testStatus = 0;
    loadFromSession = 0;
    element.innerText = 'START';
    element.className = "button is-primary is-inverted";
    document.getElementById('testStateId').style.visibility = "hidden";
    clearSessionByID();
}

function updatePauseResumeElement(element) {
    text = element.innerText;
    if (text == 'PAUSE') {
        element.innerText = 'RESUME';
        element.className = "button is-success is-hovered";
        fireAPICall('updateVusers');
        return;
    }
    element.innerText = 'PAUSE';
    element.className = "button is-warning is-active";
    fireAPICall('updateVusers');
}

function startTimer() {

    console.log("Timer Here !!");

    // Set the date we're counting down to
    if (loadFromSession == "0")
        startTimerDateObj = new Date().getTime();

    // Update the count down every 1 second
    setInterval(function() {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = now - startTimerDateObj;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

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
