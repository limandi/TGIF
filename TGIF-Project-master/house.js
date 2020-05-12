

var membersHouse;
var url = "https://api.propublica.org/congress/v1/113/house/members.json";
 
fetch(url, {
       headers: {
           "X-API-Key": "B0XqY0T7xhm1JCRGP4GMP96DmFErfu3wWcm2uu4O"
       }
   })
   .then(function (data) {
       return data.json();
   })
   .then(function (myData) {
       console.log(myData);
       membersHouse = myData.results[0].members;
    createTableHouse();
    showMemberDropDown(membersHouse);
    createStates();
})

function createTableHouse() {
    var tableBodyHouse = document.getElementById("tableBodyHouse");
    tableBodyHouse.innerHTML = "";
    for (var i = 0; i < membersHouse.length; i++) {
     
        var tableRow = document.createElement("tr");
        
        var firstName = membersHouse[i].first_name;
        var middleName = membersHouse[i].middle_name;
       
        if (middleName === null) {
            middleName = "";
        }
        var lastName = membersHouse[i].last_name;
        var completeName = firstName + " " + middleName + " " + lastName;

        var link = document.createElement("a");
        link.setAttribute("href", membersHouse[i].url);
     
        link.innerHTML = completeName;
        var party = membersHouse[i].party;
        var state = membersHouse[i].state;
        var seniority = membersHouse[i].seniority;
        var votesParty = "% " + membersHouse[i].votes_with_party_pct;
        var cells = [link, party, state, seniority, votesParty];

        if (showMember(membersHouse[i])) {
            for (var j = 0; j < cells.length; j++) {
                var tableCell = document.createElement("td");
                tableCell.append(cells[j]);
                tableRow.append(tableCell);
            }
            document.getElementById("tableBodyHouse").append(tableRow);
        }
    }
}




document.querySelectorAll("input[name=Party]")[0].addEventListener("click", createTableHouse);
document.querySelectorAll("input[name=Party]")[1].addEventListener("click", createTableHouse);
document.querySelectorAll("input[name=Party]")[2].addEventListener("click", createTableHouse);

function showMember(member) {
    var options = document.getElementById("dropDownBody").value;
    var checkboxes = document.querySelectorAll("input[name=Party]");
    var checkedCheckboxes = document.querySelectorAll("input[name=Party]:checked");
    if (checkedCheckboxes.length == 0 && options == "All") {
        return true;
    }
    for (var j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].checked && (member.party == checkboxes[j].value) && ((options === member.state || options === "All"))) {
            return true;
        } else if (checkedCheckboxes.length === 0 && options === member.state) {
            return true;
        }
    }
    return false;
}




function showMemberDropDown(member) {
    var options = document.getElementById("dropDownBody").value;
    if (options === member.state || options === "All") {
        return true;
    }
}


document.getElementById("dropDownBody").addEventListener("change", createTableHouse);

function createStates() {
    var filteredStates = [];
    for (i = 0; i < membersHouse.length; i++) {
        if (filteredStates.indexOf(membersHouse[i].state) == -1) {
            filteredStates.push(membersHouse[i].state);
            filteredStates.sort();
        }
    }
    for (var j = 0; j < filteredStates.length; j++) {
        var option = document.createElement("option");
        option.classList.add("stateOptions");
        option.setAttribute("value", filteredStates[j]);
        option.innerHTML = filteredStates[j];
        var dropDownOptions = document.getElementById("dropDownBody");
        dropDownOptions.appendChild(option);
    }
}


