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
    var html = '', branches = list, i;
    $('#dropdown-menu2').show();

    console.log(branches)

    for(i = 0; i < branches.length; i++) {
        // html += "<option value='" + branches[i] + "'>" + branches[i] + "</option>";
        html += '<a href=\"#\" class=\"dropdown-item\" onclick=\"deployFunction(\'' +  branches[i] + "\')\" id=\"" +  branches[i] + '\"' + "<p>Fire <strong>" + branches[i] + "</strong>" + ' ' +  'API call' + '</p></a>' ;
    }

    html += '</select>';
    newDiv.innerHTML= html;

    document.getElementById(divname).appendChild(newDiv);
}