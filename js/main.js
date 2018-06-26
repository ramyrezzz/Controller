/**
 *  This is the main JS.
 *  It is responsible for managing the single page controller web page.
 *
 *  TODO: Add comments in every method - scope, input and output.
 */

let totalUsers;
let projectID = '';
let sessionID = '';
let testStatus = 0;
let startTimerDateObj;
let noOfContainers = 2;
let loadFromSession = 0;
let maxContainerUsers = "20";
let cookieName = "ControllerSessionID";

$(document).mouseup(function(e) {
    var container = $(".dropdown-menu");
    // If the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0)
        container.hide();
});

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
        sessionID = generateUUID();
        setCookie(cookieName, sessionID, 1);
    }

    setInterval(
        function () {
            if (!checkControllerData())
                return;
            updateSession();
        }, 60 * 1000);
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
    document.getElementById(divname).innerHTML = '';

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
    document.getElementById(divname).innerHTML = '';
    if ($(divname).children().length > 0)
        return;

    var newDiv = document.createElement('div');
    var html = '', i;
    for(i = 0; i < list.length; i++) {
        html += '<a class=\"navbar-item is-active\" onclick=\"getSessionByID(\'' + list[i].sessionID + "\')\"><strong>Select session :</strong>" + list[i].testNameID + '</a>' + '<button class="delete" style="float: right" onclick=\"clearSessionByID(\'' + list[i].sessionID + '\')\"></button>'
    }

    html += '</div>';
    newDiv.innerHTML = html;

    document.getElementById(divname).appendChild(newDiv);
}

function buildSelectProjectDropdown(divname, list) {
    document.getElementById(divname).innerHTML = '';

    var newDiv = document.createElement('div');
    var html = '', i;
    $('#dropdown-menu3').show();
    if ($(divname).children().length > 0)
        return;

    for(i = 0; i < list.length; i++) {
        html += '<a href=\"#\" class=\"dropdown-item\" onclick=\"useSelectProject(\'' +  list[i].testName + "\','" +  list[i].threadGroups +"\' )\" id=\"" +  list[i].testName + '\"' + "<p> Use '<strong>" + list[i].testName.substring(14, list[i].testName.length - 4) + "</strong>" + '\' ' +  'project' + '</p></a>';
    }

    html += '</select>';
    newDiv.innerHTML= html;

    document.getElementById(divname).appendChild(newDiv);
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}

function disableEnableTestConfigInput(configInputState) {
    if (document.getElementById("testNameID").disabled == configInputState)
        return;
    document.getElementById("testNameID").disabled = configInputState;
    document.getElementById("usersRateID").disabled = configInputState;
    document.getElementById("totalUsersID").disabled = configInputState;
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
        element.innerText = 'STOP';
        element.className = "button is-danger is-active";
        document.getElementById("timerID").innerHTML = "0h 0m 0s";
        document.getElementById('editTestConfigID').disabled = false;
        document.getElementById('testRunningSpinnerID').style.visibility = "visible";
        document.getElementById('pauseButtonId').style.visibility = "visible"

        disableEnableTestConfigInput(true);
        startTimer();
        updateSession();
        getContainerHealth();
        if (loadFromSession == 0)
            startTestAPIRequest();
        updatePauseResumeElement(document.getElementById('pauseButtonId'));
        return;
    }
    if (text == 'STOP'){
        testStatus = 0;
        loadFromSession = 0;
        element.innerText = 'START';
        element.className = "button is-primary is-inverted";
        document.getElementById('editTestConfigID').disabled = true;
        document.getElementById('testRunningSpinnerID').style.visibility = "hidden";
        document.getElementById("selectedProjectID").style.visibility = "hidden";
        document.getElementById('pauseButtonId').style.visibility = "hidden"

        clearSessionByID(sessionID);
        showHideDropdown('visible');
        disableEnableTestConfigInput(false);
        forceStopAllContainers();
    }
}

function updatePauseResumeElement(element) {

    if (testStatus == 1) {
        element.className = "button is-success is-hovered";
        element.innerText = 'RESUME';
        testStatus = 2;
        updateSession();
        return;
    }
    if(testStatus == 0) {
        testStatus = 1;
        updateSession();
        element.innerText = 'PAUSE';
        element.className = "button is-warning is-active";
        return;
    }
    testStatus = 1;
    updateSession();
    element.innerText = 'PAUSE';
    element.className = "button is-warning is-active";
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

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById('buttonisDockerView').focus();

        if (testStatus >= 1) {
            document.getElementById("timerID").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
        }
    }, 1000);
}

function close_window() {
    window.close();
}

function checkControllerData() {

    console.log(sessionID)

    usersRateInput = document.getElementById("usersRateID").value;
    totalUsers = document.getElementById("totalUsersID").value;
    testNameID = document.getElementById("testNameID").value;
    sessionID = getCookie(cookieName)

    if (totalUsers == '')
        return false;
    if (usersRateInput == '')
        return false;
    if (testNameID == '')
        return false;
    if (projectID == '')
        return false;
    if (sessionID == '')
        return false;

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

    showHideDropdown('hidden');
    disableEnableTestConfigInput(true);
    updateStartStopElement(document.getElementById('startButtonID'));
}

function useSelectProject(testName, testGroupNames) {
    projectID = testName.substring(testName.lastIndexOf('/') + 1, testName.length);

    var label = "Selected project: " + projectID;
    var newDiv = document.createElement('div');

    var tableBody = '<table class="table is-bordered"><thead><tr><th> Thread Group </th><th> Distribution </th></tr></thead>';
    var distribution = 100;

    testGroupNames = testGroupNames.split(",");

    distribution = distribution / testGroupNames.length;
    for (let i = 0; i < testGroupNames.length; i++) {
        tableBody += "<tbody><tr><td>" + testGroupNames[i] + " </td><td> " + distribution +"% </td></tr></tbody>";
    }
    tableBody += "</table>"
    newDiv.innerHTML = tableBody;

    document.getElementById("selectedProjectID").innerText = label;
    document.getElementById("selectedProjectID").appendChild(newDiv);

    document.getElementById("selectedProjectID").style.visibility = "visible";
    $('#dropdown-menu3').hide();
}

function buildContainerList(response) {

    if (!response.results[0].hasOwnProperty('series'))
        return;

    var results = response.results[0];
    var series = results.series[0];
    var values = series.values;

    for (var i = 0; i < values.length; i++) {
        var objectID = values[i][1];
        document.getElementById(objectID).style.animationName = 'dockerContainerAnim';
    }
}

function addContainerDownState(response) {
    if (response.length < 1) {
        document.getElementById('dcaDivID').remove();
        var newDca = document.createElement('dcaDivID');
        var html = "<dca class=\"dca\" id=\"buttonisDockerView\">WebServer</dca><dca class=\"dca\" id=\"buttonisDockerView\">Influx-DB</dca><p>"
        html +=  '</select>';
        newDca.innerHTML = html;
        document.getElementById('main-nav-barID').appendAfter(document.getElementById("memoryTableID"));
        return;
    }

    noOfContainers = response.containers.length;
    var newDca = document.createElement('dca');
    var html = '';

    for (var i = 0; i < noOfContainers; i++) {
        var containerName = response.containers[i];
        var label = containerName.substring(containerName.length - 2, containerName.length);
        if (document.getElementById(containerName) == undefined)
            html += '<dca class=\"dca\" id=\"' + containerName + '\" style="padding: 2px;margin: 1.5px;">' + label + '</dca>'
    }

    if (html.length > 11) {
        html +=  '</select>';
        newDca.innerHTML = html;
        document.getElementById('dcaDivID').appendChild(newDca);
    }

    for (var i = 0; i < noOfContainers; i++) {
        document.getElementById(response.containers[i]).style.animationName = 'dockerContainerAnimDown';
    }
}

function fetchRepoJMX() {
    document.getElementById("applyGitRepoID").className = 'button is-loading';

    applyCustomRepo();

    document.getElementById("applyGitRepoID").className = 'button';
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
},false;

$(document).ready(function(){
    $('#applyGitRepoID').attr('disabled',true);
    $('#importGitRepoID').keyup(function(){
        if (document.getElementById("importGitRepoID").value.length > 0 && document.getElementById("importGitRepoID").value.endsWith(".git")) {
            document.getElementById("applyGitRepoID").disabled = false;
            return;
        }
        document.getElementById("applyGitRepoID").disabled = true;
    })
});

$(document).ready(function () {
    if (testStatus == 0)
        document.getElementById('pauseButtonId').disabled = true;
    else
        document.getElementById('pauseButtonId').disabled = false;
})

function loadPage() {
    $('#overlay').show();
    $('#loaderCcontent').show().center();

    setTimeout(function(){
        $("#overlay").fadeOut();
    }, 1000);
}

$.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (
        ($(window).height() - $(this).outerHeight()) / 2) +
        $(window).scrollTop()) + "px"
    );
    this.css("left", Math.max(0, (
        ($(window).width() - $(this).outerWidth()) / 2) +
        $(window).scrollLeft()) + "px"
    );
    return this;
}

