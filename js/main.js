/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function activateDropDown(objId) {
    document.getElementById(objId).classList.toggle("show");
}
function reload() {
    location.reload()
}

function buildDivForBranch(divname, list) {

    var newDiv=document.createElement('div');
    var html = '', i;
    $('#dropdown-menu2').show();
    if ($('#select-Branch').children().length > 0)
        return;

    for(i = 0; i < list.length; i++) {
        // html += "<option value='" + branches[i] + "'>" + branches[i] + "</option>";
        html += '<a href=\"#\" class=\"dropdown-item\" onclick=\"deployFunction(\'' +  list[i] + "\')\" id=\"" +  list[i] + '\"' + "<p>Fire <strong>" + list[i] + "</strong>" + ' ' +  'API call' + '</p></a>' ;
    }

    html += '</select>';
    newDiv.innerHTML= html;

    document.getElementById(divname).appendChild(newDiv);
}
