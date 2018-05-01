/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

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

function buildDivForBranch(divname, list) {

    var newDiv = document.createElement('div');
    var html = '', i;
    $('#dropdown-menu2').show();
    if ($('#select-Branch').children().length > 0)
        return;

    for(i = 0; i < list.length; i++)
        html += '<a href=\"#\" class=\"dropdown-item\" onclick=\"deployFunction(\'' +  list[i] + "\')\" id=\"" +  list[i] + '\"' + "<p>Fire <strong>" + list[i] + "</strong>" + ' ' +  'API call' + '</p></a>' ;

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
        fireAPICall('updateVusers', '', '1', '1');
        document.getElementById('testStateId').style.visibility = "visible";
    }
    else {
        element.innerText = 'START';
        element.className = "button is-primary is-inverted";
        fireAPICall('updateVusers', '', '0', '0');
        document.getElementById('testStateId').style.visibility = "hidden";
    }
}

function updatePauseResumeElement(element) {
    text = element.innerText;
    if (text == 'PAUSE') {
        element.innerText = 'RESUME';
        element.className = "button is-success is-hovered";
        fireAPICall('updateVusers', '', '1', '0');
        return;
    }
    else {
        element.innerText = 'PAUSE';
        element.className = "button is-warning is-active";
        fireAPICall('updateVusers', '', '0', '1');
    }
}