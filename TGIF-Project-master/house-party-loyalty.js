var membersHouse;
var url = "https://api.propublica.org/congress/v1/113/house/members.json";

var democrats = [];
var republicans = [];
var independents = [];

var allDemocratsVotedPercantages = [];
var allRepublicansVotedPercantages = [];
var allIndependentsVotedPercantages = [];

var statisticsHouse;
var bottom10PctMembersByVotesWithPartyHouse = [];
var top10PctMembersByVotesWithPartyHouse = [];


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

        getMembersFromParties(membersHouse);
        fillTheObject();
        partyPctVoted(allDemocratsVotedPercantages);
        partyPctVoted(allRepublicansVotedPercantages);
        partyPctVoted(allIndependentsVotedPercantages);
        getBottomAndTop10PctLoyaltyHouse(sortMembersByVotesWithPartyPctHouse(), true);
        getBottomAndTop10PctLoyaltyHouse(sortMembersByVotesWithPartyPctHouse(), false);
        createLeastAndMostLoyalTables("houseLeastLoyalTable", bottom10PctMembersByVotesWithPartyHouse);
        createLeastAndMostLoyalTables("houseMostLoyalTable", top10PctMembersByVotesWithPartyHouse);
        createTopTableHouse(statisticsHouse, "houseLoyaltyTable");

    })

function getMembersFromParties(membersHouse) {
   
    for (var i = 0; i < membersHouse.length; i++) {
        
        if (membersHouse[i].party === "D") {
           
            democrats.push(membersHouse[i]);
          
            allDemocratsVotedPercantages.push(membersHouse[i].votes_with_party_pct);
        } else if (membersHouse[i].party === "R") {
            republicans.push(membersHouse[i]);
            allRepublicansVotedPercantages.push(membersHouse[i].votes_with_party_pct);
        } else {
            independents.push(membersHouse[i]);
            allIndependentsVotedPercantages.push(membersHouse[i].votes_with_party_pct);
        }
    }
}

function fillTheObject() {
    statisticsHouse = {
        "parties": [
            {
                "party": "Democrats",
                "number_of_members": democrats.length,
                "votes_with_party_pct": partyPctVoted(allDemocratsVotedPercantages) + " %"
        },
            {
                "party": "Republicans",
                "number_of_members": republicans.length,
                "votes_with_party_pct": partyPctVoted(allRepublicansVotedPercantages) + " %"
        },
            {
                "party": "Independents",
                "number_of_members": independents.length,
                "votes_with_party_pct": partyPctVoted(allIndependentsVotedPercantages) + " %"
        },
            {
                "party": "Total",
                "number_of_members": democrats.length + republicans.length + independents.length,
                "votes_with_party_pct": 0
            }
        ]
    }
    getTotalAvgPercentage(statisticsHouse);
}

function partyPctVoted(arr) {
    var sum = 0;
    if (arr.length === 0) {
        return (0.00);
    } else {
        for (var i = 0; i < arr.length; i++) {
            sum = sum + arr[i];
        }
    }
    var average =Math.round(sum / arr.length);
    return average;
}



function sortMembersByVotesWithPartyPctHouse() {
    var allMembers = Array.from(membersHouse);
    allMembers.sort(function (a, b) {
        return (a.votes_with_party_pct > b.votes_with_party_pct) ? 1 : ((b.votes_with_party_pct > a.votes_with_party_pct) ? -1 : 0);
    });
    return allMembers;
}


function getBottomAndTop10PctLoyaltyHouse(sortMembersByVotesWithPartyPctHouse, acc) {
   
    var num = Math.round(sortMembersByVotesWithPartyPctHouse.length * 0.1);
    if (acc) {
        for (var i = 0; i < num; i++) {
            bottom10PctMembersByVotesWithPartyHouse.push(sortMembersByVotesWithPartyPctHouse[i]);
        }

        for (var j = num; j < sortMembersByVotesWithPartyPctHouse.length; j++) {
            if (sortMembersByVotesWithPartyPctHouse[j].votes_with_party_pct === sortMembersByVotesWithPartyPctHouse[num - 1].missed_votes_pct) {
                bottom10PctMembersByVotesWithPartyHouse.push(sortMembersByVotesWithPartyPctHouse[j]);
            }
        }
    } else {

        for (var k = sortMembersByVotesWithPartyPctHouse.length - 1; k > sortMembersByVotesWithPartyPctHouse.length - num - 1; k--) {
            top10PctMembersByVotesWithPartyHouse.push(sortMembersByVotesWithPartyPctHouse[k]);
        }
        for (var l = sortMembersByVotesWithPartyPctHouse.length - num - 1; l > 0; l--) {
            if (sortMembersByVotesWithPartyPctHouse[l].votes_with_party_pct === sortMembersByVotesWithPartyPctHouse[sortMembersByVotesWithPartyPctHouse.length - num].votes_with_party_pct) {
                top10PctMembersByVotesWithPartyHouse.push(sortMembersByVotesWithPartyPctHouse[l]);
            }
        }
    }
}

//TABLES
function createTopTableHouse(statisticsHouse, idname) {
    var parties = statisticsHouse.parties
    for (var i = 0; i < parties.length; i++) {
        var tableRow = document.createElement("tr");
        var party = parties[i].party;
        var numberOfReps = parties[i].number_of_members;
        var votesWithParty = parties[i].votes_with_party_pct;
        var cells = [party, numberOfReps, votesWithParty];
        for (var j = 0; j < cells.length; j++) {
            var tableCell = document.createElement("td");
            tableCell.append(cells[j]);
            tableRow.append(tableCell);
        }
        document.getElementById(idname).append(tableRow);
    }
}


function createLeastAndMostLoyalTables(idname, arr) {
    for (var i = 0; i < arr.length; i++) {
        var tableRow = document.createElement("tr");
        var firstName = arr[i].first_name;
        var middleName = arr[i].middle_name;
       
        if (middleName === null) {
            middleName = "";
        }
        var lastName = arr[i].last_name;
        var completeName = firstName + " " + middleName + " " + lastName;
        var numMissedVotes = arr[i].total_votes;
        var pctMissedVotes = arr[i].votes_with_party_pct + " %";
        var cells = [completeName, numMissedVotes, pctMissedVotes];
        for (var j = 0; j < cells.length; j++) {
            var tableCell = document.createElement("td");
            tableCell.append(cells[j]);
            tableRow.append(tableCell);
        }
        document.getElementById(idname).append(tableRow);
    }
}

function getTotalAvgPercentage(statisticsHouse) {
    if (statisticsHouse.parties[2].number_of_members == 0) {
        statisticsHouse.parties[3].votes_with_party_pct = (((partyPctVoted(allDemocratsVotedPercantages) + partyPctVoted(allRepublicansVotedPercantages)) / 2)+ " %") ;
    } else {
        statisticsHouse.parties[3].votes_with_party_pct = (((partyPctVoted(allDemocratsVotedPercantages) + partyPctVoted(allRepublicansVotedPercantages) + partyPctVoted(allIndependentsVotedPercantages)) / 3)+ " %")
    }
}