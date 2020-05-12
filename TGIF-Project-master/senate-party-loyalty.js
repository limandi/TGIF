var members;
var url = "https://api.propublica.org/congress/v1/113/senate/members.json";

var democrats = [];
var republicans = [];
var independents = [];

var allDemocratsVotedPercantages = [];
var allRepublicansVotedPercantages = [];
var allIndependentsVotedPercantages = [];

var statistics;
var bottom10PctMembersByVotesWithParty = [];
var top10PctMembersByVotesWithParty = [];

fetch(url, {
        headers: {
            "X-API-Key": "B0XqY0T7xhm1JCRGP4GMP96DmFErfu3wWcm2uu4O"
        }
    })
    .then(function (data) {
        return data.json();
    })
    .then(function (myData) {
        var members = myData.results[0].members;

        getMembersFromParties(members);
        fillTheObject();
        partyPctVoted(allDemocratsVotedPercantages);
        partyPctVoted(allRepublicansVotedPercantages);
        partyPctVoted(allIndependentsVotedPercantages);
        getBottomAndTop10PctLoyalty(sortMembersByVotesWithPartyPct(members), true);
        getBottomAndTop10PctLoyalty(sortMembersByVotesWithPartyPct(members), false);
        createLeastAndMostLoyalTables("senateLeastLoyalTable", bottom10PctMembersByVotesWithParty);
        createLeastAndMostLoyalTables("senateMostLoyalTable", top10PctMembersByVotesWithParty);
        createTopTable(statistics, "senateLoyaltyTable");
    })


function getMembersFromParties(members) {

    for (var i = 0; i < members.length; i++) {

        if (members[i].party === "D") {
           
            democrats.push(members[i]);
           
            allDemocratsVotedPercantages.push(members[i].votes_with_party_pct);
        } else if (members[i].party === "R") {
            republicans.push(members[i]);
            allRepublicansVotedPercantages.push(members[i].votes_with_party_pct);
        } else {
            independents.push(members[i]);
            allIndependentsVotedPercantages.push(members[i].votes_with_party_pct);
        }
    }
}

function fillTheObject() {
    statistics = {
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
    getTotalAvgPercentage(statistics);
}

function partyPctVoted(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum = sum + arr[i];
    }
    var average = Math.round(sum / arr.length);
    return average;
}


function sortMembersByVotesWithPartyPct(members) {
    var allMembers = Array.from(members);
    allMembers.sort(function (a, b) {
        return (a.votes_with_party_pct > b.votes_with_party_pct) ? 1 : ((b.votes_with_party_pct > a.votes_with_party_pct) ? -1 : 0);
    });
    return allMembers;
}




function getBottomAndTop10PctLoyalty(sortMembersByVotesWithPartyPct, acc) {
    
    var num = Math.round(sortMembersByVotesWithPartyPct.length * 0.1);
    if (acc) {
        for (var i = 0; i < num; i++) {
            bottom10PctMembersByVotesWithParty.push(sortMembersByVotesWithPartyPct[i]);
        }

        for (var j = num; j < sortMembersByVotesWithPartyPct.length; j++) {
            if (sortMembersByVotesWithPartyPct[j].votes_with_party_pct === sortMembersByVotesWithPartyPct[num - 1].missed_votes_pct) {
                bottom10PctMembersByVotesWithParty.push(sortMembersByVotesWithPartyPct[j]);
            }
        }
    } else {

        for (var k = sortMembersByVotesWithPartyPct.length - 1; k > sortMembersByVotesWithPartyPct.length - num - 1; k--) {
            top10PctMembersByVotesWithParty.push(sortMembersByVotesWithPartyPct[k]);
        }
        for (var l = sortMembersByVotesWithPartyPct.length - num - 1; l > 0; l--) {
            if (sortMembersByVotesWithPartyPct[l].votes_with_party_pct === sortMembersByVotesWithPartyPct[sortMembersByVotesWithPartyPct.length - num].votes_with_party_pct) {
                top10PctMembersByVotesWithParty.push(sortMembersByVotesWithPartyPct[l]);
            }
        }
    }
}


function createTopTable(statistics, idname) {
    var parties = statistics.parties
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
        var pctMissedVotes =arr[i].votes_with_party_pct + " %";
        var cells = [completeName, numMissedVotes, pctMissedVotes];
        for (var j = 0; j < cells.length; j++) {
            var tableCell = document.createElement("td");
            tableCell.append(cells[j]);
            tableRow.append(tableCell);
        }
        document.getElementById(idname).append(tableRow);
    }
}

function getTotalAvgPercentage(statistics) {
    if (statistics.parties[2].number_of_members == 0) {
        statistics.parties[3].votes_with_party_pct = (((partyPctVoted(allDemocratsVotedPercantages) + partyPctVoted(allRepublicansVotedPercantages)) / 2)+ " %") ;
    } else {
        statistics.parties[3].votes_with_party_pct = (((partyPctVoted(allDemocratsVotedPercantages) + partyPctVoted(allRepublicansVotedPercantages) + partyPctVoted(allIndependentsVotedPercantages)) / 3)+ " %")
    }
}