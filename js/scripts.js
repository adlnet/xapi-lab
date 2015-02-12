/* Initialize */

// Initialize the editor
var editor = ace.edit('editor');
editor.getSession().setMode('ace/mode/javascript');

// Handle XAPIWrapper XHR Errors
ADL.xhrRequestOnError = function(xhr, method, url, callback, callbackargs) {
    console.log(xhr);
    var $lrsr = $('#lrs-response');
    $lrsr.html('').attr('class', '').html(xhr.statusText + " (Status " + xhr.status + "): " + xhr.response).attr("class", "alert bg-danger text-danger");
};

stmts = [];

// Page Load
$(function(){
    // Pretty Print
    prettyPrint();

    // Populate the predefined verbs dropdown
    for (var key in ADL.verbs) {
        var $options1 = $("#predefined-verb");
        var $options2 = $("#search-predefined-verb");
        if (ADL.verbs.hasOwnProperty(key)) {
            //console.log(key + " -> " + ADL.verbs[key]['id'] + " -- " + ADL.verbs[key]['display']['en-US']);
            $options1.append($("<option />").val(ADL.verbs[key]['id']).text(ADL.verbs[key]['display']['en-US']));
            $options2.append($("<option />").val(ADL.verbs[key]['id']).text(ADL.verbs[key]['display']['en-US']));
        }
    }

    $('#search-statements-since-date').datetimepicker();
    $('#search-statements-until-date').datetimepicker();

    var hash = window.location.hash;
    hash && $('ul.nav a[href="' + hash + '"]').tab('show');

    $('.nav-tabs a').click(function (e) {
        $(this).tab('show');
        if (history.pushState) {
            history.pushState(null, null, this.hash);
        } else {
            location.hash = this.hash;;
        }
    });
});

/*
 * Bindings
 */

/* General */
 
$(".collapser a").click(function (e) { e.preventDefault(); });


/* Statement Builder */

$("#statement-values").change(function(e) {
    if ($("#automatically-build").is(':checked')) {
        previewStatement();
    }
});

$("#predefined-verb").change(function() {
    var $this = $(this);
    $("#verb-id").val($this.val());
    $("#verb-display").val($this.children(':selected').text());
});


/*  Statement Manipulation and Response -- Sending */

$("#generate-statement").click(function(e) {
    previewStatement();
    e.preventDefault();
});

// Try parsing JSON to validate it
$("#validate-json").click(function(e) {
    var r = validateJSON(editor.getValue());
    alert(r);
    e.preventDefault();
});

$("#queue-statement").click(function(e) {
    queueStatement();
    e.preventDefault();
});

$("#send-statement").click(function(e) {
    sendStatement();
    e.preventDefault();
});

$("#clear-sent-statements").click(function(e) {
    clearSentStatements();
    e.preventDefault();
});

$("#clear-statement-queue").click(function(e) {
    clearStatementQueue();
    e.preventDefault();
});

$("#send-statement-queue").click(function(e) {
    sendStatementQueue();
    e.preventDefault();
});


/*  Statement Manipulation and Response -- Receiving */

$("#search-predefined-verb").change(function() {
    var $this = $(this);
    $("#search-user-verb-id").val($this.val());
});

$("#get-statements-with-search").click(function(e) {
    getStatementsWithSearch();
    e.preventDefault();
});

$("#clear-received-statements").click(function(e) {
    clearReceivedStatements();
    e.preventDefault();
});


/*  Document Manipulation and Response -- Sending */

$("#send-state").click(function(e) {
    sendState();
    e.preventDefault();
});

$("#clear-sent-documents").click(function(e) {
    clearSentDocuments();
    e.preventDefault();
});


/*  Document Manipulation and Response -- Receiving */

$("#get-state").click(function(e) {
    getState();
    e.preventDefault();
});

$("#clear-received-documents").click(function(e) {
    clearReceivedDocuments();
    e.preventDefault();
});

/*
 * Functions
 */

// Override any credentials put in the XAPIWrapper.js
function setupConfig() {
    // get LRS credentials from user interface
    var endpoint = $("#endpoint").val();
    var user = $("#username").val();
    var password = $("#password").val();

    var conf = {
      "endpoint" : endpoint,
      "auth" : "Basic " + toBase64(user + ":" + password),
    };
    ADL.XAPIWrapper.changeConfig(conf);
}

// Build statement from the GUI
function buildStatement() {
    var actorEmail = $("#actor-email").val();
    var actorName = $("#actor-name").val();
    var verbID = $("#verb-id").val();
    var verbDisplay = $("#verb-display").val();
    var language = $("#language").val();
    var activityID = $("#activity-id").val();
    var activityName = $("#activity-name").val();
    var activityDescription = $("#activity-description").val();

    var stmt = {};
    stmt['actor'] = {};
    stmt['actor']['mbox'] = "mailto:" + actorEmail;
    stmt['actor']['name'] = actorName;
    stmt['actor']['objectType'] = "Agent";
    stmt['verb'] = {};
    stmt['verb']['id'] = verbID;
    stmt['verb']['display'] = {};
    stmt['verb']['display'][language] = verbDisplay;
    stmt['object'] = {};
    stmt['object']['id'] = activityID;
    stmt['object']['objectType'] = "Activity";
    stmt['object']['definition'] = {};
    stmt['object']['definition']['name'] = {};
    stmt['object']['definition']['name'][language] = activityName;
    stmt['object']['definition']['description'] = {};
    stmt['object']['definition']['description'][language] = activityDescription;

    //console.log(stmt);
    return stmt;
}

// Validate JSON
function validateJSON(json) {
    try {
        var c = $.parseJSON(json);
        return true;
    } catch (err) {
        return err;
    }
}


/*  Statement Manipulation and Response -- Sending */

// Generate statement and preview in the editor
function previewStatement() {
    var stmt = buildStatement();

    editor.setValue(JSON.stringify(stmt, undefined, 4)); // or session.setValue
    editor.clearSelection(); // or session.setValue
}

// Send statement to the LRS
function sendStatement() {
    setupConfig();

    var stmt = editor.getValue(); // or session.getValue

    if (validateJSON(stmt) != true) { // JSON is invalid
        alert("invalid JSON");
        return false;
    }

    // clean out the LRS response status
    var $lrsr = $('#lrs-response');
    $lrsr.html('').attr('class', '');

    var xstmt = $.parseJSON(stmt);

    ADL.XAPIWrapper.sendStatement(xstmt, function(resp, obj) {
        //console.log(resp);
        //console.log(obj);
        // update the status in the HTML
        if (resp.status == 200) {
            $lrsr.html("<b><em>" + xstmt.verb.display['en-US'] + "</em></b> statement sent successfully to LRS").attr("class", "alert bg-success text-success");
        }
        var prettyStatement = styleStatementView(xstmt.id, xstmt);
        $("#sent-statements").append(prettyStatement);
        PR.prettyPrint();
    });
}

// Add valid statement to queue
function queueStatement(stmt) {
    var stmt = editor.getValue(); // or session.getValue

    if (validateJSON(stmt) != true) { // JSON is invalid
        alert("invalid JSON, cannot add to queue");
        return false;
    }
    
    var xstmt = $.parseJSON(stmt);

    var _stmt = new ADL.XAPIStatement(stmt);
    _stmt.generateId();
    stmts.push(xstmt);

    var prettyStatement = styleStatementView(_stmt.id, xstmt);
    $("#statement-queue").append(prettyStatement);
    PR.prettyPrint();
}

// Send statements from Queue to LRS
function sendStatementQueue() {
    setupConfig();

    // clean out the LRS response status
    var $lrsr = $('#lrs-response');
    $lrsr.html('').attr('class', '');

    //var xstmts = $.parseJSON(stmts);

    ADL.XAPIWrapper.sendStatements(stmts, function(resp, obj) {
        //console.log(resp);
        //console.log(obj);
        // update the status in the HTML
        if (resp.status == 200) {
            $lrsr.html("<b><em>Statement Queue</em></b> sent successfully to LRS").attr("class", "alert bg-success text-success");
            //console.log(resp, obj);

            var prettyStatement = styleStatementsView(obj[0], stmts);
            $("#sent-statements").append(prettyStatement);
            PR.prettyPrint();

            $("#statement-queue").html("");
            stmts = [];
        }
    });
}

// Clear Statements sent to the LRS
function clearSentStatements() {
    $("#sent-statements").html("");
}

// Clear Statements from Queue
function clearStatementQueue() {
    $("#statement-queue").html("");
    stmts = [];
}

// Pretty view of statements
function styleStatementView(id, stmt) {
    var rand = Math.random().toString(36).substr(2, 5);
    return '<div class="panel panel-info"><div class="panel-heading collapser"><h4 class="panel-title"><a data-toggle="collapse" data-target="#' + rand + id + '" href="#' + rand + id + '" class="collapsed">' + id + '</a></h4></div><div id="' + rand + id + '" class="panel-collapse collapse"><div class="panel-body"><pre class="prettyprint lang-js" >' + JSON.stringify(stmt, undefined, 4) + '</pre></div></div></div>';
}

// Pretty view of statements
function styleStatementsView(id, stmts) {
    var rand = Math.random().toString(36).substr(2, 5);
    return '<div class="panel panel-primary"><div class="panel-heading collapser"><h4 class="panel-title"><a data-toggle="collapse" data-target="#' + rand + id + '" href="#' + rand + id + '" class="collapsed">Group ' + id + " [" + stmts.length + "]" + '</a></h4></div><div id="' + rand + id + '" class="panel-collapse collapse"><div class="panel-body"><pre class="prettyprint lang-js" >' + JSON.stringify(stmts, undefined, 4) + '</pre></div></div></div>';
}


/*  Statement Manipulation and Response -- Receiving */

// Retreive statements from the LRS
function getStatementsWithSearch() {
    setupConfig();

    // clean out the LRS response status
    var $lrsr = $('#lrs-response');
    $lrsr.html('').attr('class', '');

    var verbSort = $("#search-verb-sort").val();
    var verbId = $("#search-user-verb-id").val();
    var actorEmail = $("#search-actor-email").val();
    var activityId = $("#search-activity-id").val();
    var statementId = $("#search-statement-id").val();
    var sinceDate = $("#search-statements-since-date input").val();
    var untilDate = $("#search-statements-until-date input").val();
    var limit = $("#search-limit").val();

    // Build Search
    var search = ADL.XAPIWrapper.searchParams();
    if (verbId != "") { search['verb'] = verbId; }
    if (verbSort != "") { search['ascending'] = verbSort; }
    if (actorEmail != "") { search['agent'] = JSON.stringify({ "mbox": "mailto:" + actorEmail}); }
    if (activityId != "") { search['activity'] = activityId; }
    if (statementId != "") { search['statementId'] = statementId; }
    if (sinceDate != "") { search['since'] = sinceDate; }
    if (untilDate != "") { search['until'] = untilDate; }
    if (limit != "") { search['limit'] = limit; }
    //console.log(search);

    ADL.XAPIWrapper.getStatements(search, null, function(r) {
        //console.log(r);
        var response = $.parseJSON(r.response);

        // update the status in the HTML
        if (r.status == 200) {

            // Handle case where only a single statement is returned
            // using statementId or voidedStatementId
            if (response.hasOwnProperty('statements')) {
                var stmts = response.statements;
                var length = stmts.length;
            } else {
                var stmt = response;
                var length = 1;
            }

            $lrsr.html(length + " statements received successfully from LRS").attr("class", "alert bg-success text-success");

            if (length > 0) {
                if (stmt) {
                    var prettyStatement = styleStatementView(stmt.id, stmt);
                } else {
                    var prettyStatement = styleStatementsView(stmts[0].id, stmts);
                }
                $("#received-statements").append(prettyStatement);
                PR.prettyPrint();
            }
        }
    });
}

// Clear Statements received from the LRS
function clearReceivedStatements() {
    $("#received-statements").html("");
}


/*  Document Manipulation and Response -- Sending */
function sendState() {
    setupConfig();

    // clean out the LRS response status
    var $lrsr = $('#lrs-state-response');
    $lrsr.html('').attr('class', '');

    var activityId = $("#set-document-activity-id").val();
    var actorEmail = $("#set-document-actor-email").val(); // TODO: Agent
    var stateId = $("#set-document-state-id").val();
    // registration    
    var stateValue = $("#set-document-state-string").val();
    // matchHash
    // noneMatchHash
    // callback

    ADL.XAPIWrapper.sendState(activityId, {"mbox":"mailto:" + actorEmail}, stateId, null, stateValue, null, null, function(r) {
      $lrsr.html("Status " + r.status + ": " + r.statusText).attr("class", "alert bg-success text-success");
      $("#sent-documents").append("<p><b>" + stateId + "</b>: " + stateValue + "</p>");
      console.log(r);
    });
}

function clearSentDocuments() {
    $("#sent-documents").html("");
}



/*  Document Manipulation and Response -- Receiving */
function getState() {
    setupConfig();
    
    // clean out the LRS response status
    var $lrsr = $('#lrs-state-response');
    $lrsr.html('').attr('class', '');

    var activityId = $("#get-document-activity-id").val();
    var actorEmail = $("#get-document-actor-email").val(); // TODO: Agent
    var stateId = $("#get-document-state-id").val();
    // registration
    // since
    // callback

    ADL.XAPIWrapper.getState(activityId, {"mbox":"mailto:" + actorEmail}, stateId, null, null, function(r) {
      $lrsr.html("Status " + r.status + ": " + r.statusText).attr("class", "alert bg-success text-success");
      $("#received-documents").append("<p>" + r.response + "</p>");
      console.log(r);
    });
}

function clearReceivedDocuments() {
    $("#received-documents").html("");
}
