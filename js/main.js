/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

var stopTimer = 0;

$(document).mouseup(function(e) {
    var container = $(".dropdown-menu");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0)
        container.hide();
});

function activateDropDown(objId) {
    document.getElementById(objId).classList.toggle("show");
}
function reload() {
    location.reload()
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
    text = element.innerText;
    if (text == 'START') {
        element.innerText = 'STOP';
        element.className = "button is-danger is-active";
        fireAPICall('updateVusers');
        startTimer();
        document.getElementById('testStateId').style.visibility = "visible";
    }
    else {
        element.innerText = 'START';
        element.className = "button is-primary is-inverted";
        fireAPICall('updateVusers');
        stopTimer = 1;
        document.getElementById('testStateId').style.visibility = "hidden";
    }
}

function updatePauseResumeElement(element) {
    text = element.innerText;
    if (text == 'PAUSE') {
        element.innerText = 'RESUME';
        element.className = "button is-success is-hovered";
        fireAPICall('updateVusers');
        return;
    }
    else {
        element.innerText = 'PAUSE';
        element.className = "button is-warning is-active";
        fireAPICall('updateVusers');
    }
}

function startTimer() {

    // Set the date we're counting down to
    var startTimerDateObj = new Date().getTime();

    // Update the count down every 1 second
    var x = setInterval(function() {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = now - startTimerDateObj;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (stopTimer < 1) {
            // Display the result in the element with id="demo"
            document.getElementById("timerID").innerHTML = hours + "h "
                + minutes + "m " + seconds + "s ";
        }
    }, 1000);
}

function close_window() {
    window.close();
}