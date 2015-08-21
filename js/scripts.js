/* Initialize */

// Initialize the editor
var editor = ace.edit('editor');
editor.getSession().setMode('ace/mode/javascript');
editor.on('change', function() {
    var r = validateJSON(editor.getValue());
    btnValidateJSON(r);
});

var notificationSettings = {
    animate: {
        enter: 'animated fadeInUp',
        exit: 'animated fadeOutDown'
    },
    type: "success",
    placement: {
        from: "bottom",
        align: "right"
    },
    progressbar: false
};
var notificationErrorSettings = jQuery.extend(true, {}, notificationSettings);
notificationErrorSettings.type = "danger";
var notificationWarningSettings = jQuery.extend(true, {}, notificationSettings);
notificationWarningSettings.type = "warning";

var dateTimeSettings = {
    showTodayButton: true,
    showClear: true
};

// Handle XAPIWrapper XHR Errors
ADL.xhrRequestOnError = function(xhr, method, url, callback, callbackargs) {
    console.log(xhr);
    notify({ title: "Status " + xhr.status + " " + xhr.statusText + ": ", message: xhr.response }, notificationErrorSettings);
};

// Handle XAPIWrapper Logs
ADL.XAPIWrapper.log = function(str) {
    console.log(str);
    if (str != "updating lrs object with new configuration")
      notify({ message: str }, notificationErrorSettings);
};

stmts = [];

// Examples -- for text areas where multiline placeholders aren't allowed
var accountAgentExample = {
  "name": "xapiguy",
  "homePage": "http://example.com"
};

var accountGroupExample = {
  "name": "Team xAPI",
  "homePage": "http://xapi.adlnet.gov"
};

var groupExample = [
    {
        "name": "Bob",
        "account": {
            "homePage": "http://www.example.com",
            "name": "13936749"
        },
        "objectType": "Agent"
    },
    {
        "name": "Alice",
        "mbox_sha1sum": "ebd31e95054c018b10727de4db3ef2ec3a016ee9",
        "objectType": "Agent"
    }
];

var groupExample2 = [
    {
        "name": "Bob",
        "account": {
            "homePage": "http://www.example.com",
            "name": "13936749"
        },
        "objectType": "Agent"
    },
    {
        "name": "Carol",
        "openid": "http://carol.openid.example.org/",
        "objectType": "Agent"
    },
    {
        "name": "Tom",
        "mbox": "mailto:tom@example.com",
        "objectType": "Agent"
    },
    {
        "name": "Alice",
        "mbox_sha1sum": "ebd31e95054c018b10727de4db3ef2ec3a016ee9",
        "objectType": "Agent"
    }
];

var componentListChoicesExample = [
    {
        "id": "golf", 
        "description": {
            "en-US": "Golf Example"
        }
    },
    {
        "id": "facebook", 
        "description": {
            "en-US": "Facebook App"
        }
    },
    {
        "id": "tetris", 
        "description": {
            "en-US": "Tetris Example"
        }
    },
    {
        "id": "scrabble", 
        "description": {
            "en-US": "Scrabble Example"
        }
    }
];

var componentListScaleExample = [
    {
        "id": "likert_0", 
        "description": {
            "en-US": "It's OK"
        }
    },
    {
        "id": "likert_1", 
        "description": {
            "en-US": "It's Pretty Cool"
        }
    },
    {
        "id": "likert_2", 
        "description": {
            "en-US": "It's Damn Cool"
        }
    },
    {
        "id": "likert_3", 
        "description": {
            "en-US": "It's Gonna Change the World"
        }
    }
];

var componentListSourceExample = [
    {
        "id": "ben",
        "description": {
            "en-US": "Ben"
        }
    },
    {
        "id": "chris",
        "description": {
            "en-US": "Chris"
        }
    },
    {
        "id": "troy",
        "description": {
            "en-US": "Troy"
        }
    },
    {
        "id": "freddie",
        "description": {
            "en-US": "Freddie"
        }
    }
];

var componentListTargetExample = [
    {
        "id": "1",
        "description": {
            "en-US": "Swift Kick in the Grass"
        }
    },
    {
        "id": "2",
        "description": {
            "en-US": "We got Runs"
        }
    },
    {
        "id": "3",
        "description": {
            "en-US": "Duck"
        }
    },
    {
        "id": "4",
        "description": {
            "en-US": "Van Delay Industries"
        }
    }
];

var componentListStepsExample = [
    {
        "id": "pong", 
        "description": {
            "en-US": "Net pong matches won"
        }
    },
    {
        "id": "dg", 
        "description": {
            "en-US": "Strokes over par in disc golf at Liberty"
            }
        },
    {
        "id": "lunch", 
        "description": {
            "en-US": "Lunch having been eaten"
        }
    }
];

var correctResponsesPatternChoice = [
    "golf[,]tetris"
];

var correctResponsesPatternSequencing = [
    "tim[,]mike[,]ells[,]ben"
];

var correctResponsesPatternLikert = [
    "likert_3"
];

var correctResponsesPatternMatching = [
    "ben[.]3[,]chris[.]2[,]troy[.]4[,]freddie[.]1"
];

var correctResponsesPatternPerformance = [
    "pong[.]1:[,]dg[.]:10[,]lunch[.]"
];

var correctResponsesPatternTrueFalse = [
    "true"
];

var correctResponsesPatternFillIn = [
    "Bob's your uncle"
];

var correctResponsesPatternLongFillIn = [
    "{case_matters=false}{lang=en}To store and provide access to learning experiences."
];

var correctResponsesPatternNumeric = [
    "4[:]"
];

var correctResponsesPatternOther = [
    "(35.937432,-86.868896)"
];

var substatementExample = {
    "actor" : {
        "objectType": "Agent",
        "mbox":"mailto:test@example.com" 
    },
    "verb" : { 
        "id":"http://example.com/visited", 
        "display":{
            "en-US":"will visit"
        } 
    },
    "object": {
        "objectType": "Activity",
        "id":"http://example.com/website",
        "definition": { 
            "name" : {
                "en-US":"Some Awesome Website"
            }
        }
    }
};

var contextActivitiesExample = {
  "grouping": [
    {
      "definition": {
        "name": {
          "en-US": "Statement Builder Context"
        }
      },
      "id": "http://adlnet.github.io/xapi-lab/index.html#context",
      "objectType": "Activity"
    }
  ],
  "parent": [
    {
      "definition": {
        "name": {
          "en-US": "xAPI Lab"
        },
        "description": {
          "en-US": "Assisting in developing statements and communicating with a Learning Record Store (LRS)"
        }
      },
      "id": "http://adlnet.github.io/xapi-lab",
      "objectType": "Activity"
    }
  ],
  "category": [
    {
      "id": "http://example.com/xapi/profile/xapi-tool"
    }
  ],
  "other": [
    {
      "id": "http://adlnet.github.io"
    }
  ]
};


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
    
    // Populate textareas
    $("#actor-group-members").val(JSON.stringify(groupExample, undefined, 4));
    $("#object-group-members").val(JSON.stringify(groupExample2, undefined, 4));
    $("#object-substatement-json").val(JSON.stringify(substatementExample, undefined, 4));

    $("#actor-types > div").hide();
    $("#actor-Agent").show();

    $("#object-types > div").hide();
    $("#object-Activity").show();
    
    $("#component-lists > div").hide();
    $("#correct-responses-pattern").hide();

    $("#statement-timestamp").datetimepicker(dateTimeSettings);
    $("#search-statements-since-date").datetimepicker(dateTimeSettings);
    $("#search-statements-until-date").datetimepicker(dateTimeSettings);
    $("#get-document-since-date").datetimepicker(dateTimeSettings);

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
 
$("body").on("click", ".collapser a", function (e) { e.preventDefault(); });

$('#opener').on('click', function() {		
  var $console = $('#console-panel');
  if ($console.hasClass("visible")) {
    $console.removeClass('visible').animate({'margin-right':'-400px'});
  } else {
    $console.addClass('visible').animate({'margin-right':'0px'});
  }	
  return false;	
});

// Allow links inside collapsing headers to be clicked
$(".panel-heading.collapser a:not([data-toggle='collapse'])").on("click", function(event) {
    event.stopPropagation();
});

/* Statement Builder */

$("#statement-builder-values").change(function() {
    considerPreviewStatement();
});

$("#actor-Agent :input").on('keyup cut', function(e){
    // Only worry about backspace (keyCode 8), make sure to include cut as well
    if (e.type == "cut" || e.type == "keyup" && e.keyCode == 8){
        // Only worry about IFIs, not name
        if (this.id != "actor-agent-name"){
            // Only capture backspace or cut to make IFI input empty
            if (!this.value){
                var inputs = $('input, textarea', '#actor-Agent' + ' .ifi').filter(function() {
                    if (this.name != "actor-agent-name") return $.trim( this.value ).length > 0;
                });
                // If there is only one IFI input with text in it then remove all errors/warnings
                if (inputs.length == 1){
                    $('input, textarea', '#actor-Agent' + ' .ifi').filter(function() {
                        $(this).parent("div").removeClass("has-error");
                        $(this).next("div").empty();
                    });
                }
            }        
        }
    } 
});

$("#statement-builder-values").validator({
    custom: {
        actor_agent_ifi: function ($el) {
            return validateAgentIFI('#actor-Agent');
        },
        actor_group_ifi: function ($el) {
            return validateGroupIFI('#actor-Group', '#actor-group-members');
        },
        object_agent_ifi: function ($el) {
            return validateAgentIFI('#object-Agent');
        },
        object_group_ifi: function ($el) {
            return validateGroupIFI('#object-Group', '#object-group-members');
        }
    },
    errors: {
        actor_agent_ifi: 'Only use one IFI',
        actor_group_ifi: 'Only use one IFI, or include group members for Anonymous Group',
        object_agent_ifi: 'Only use one IFI',
        object_group_ifi: 'Only use one IFI, or include group members for Anonymous Group'
    }
});
$("#statement-search-values").validator();
$("#dmar-values").validator();

$("#actor-type").change(function() {
    var actorType = $(this).val();
    $("#actor-types > div").hide();
    $("#actor-types > #actor-" + actorType).show();
});

$("#actor-agent-account-example").click(function(e) {
    $("#actor-agent-account").val(JSON.stringify(accountAgentExample, undefined, 4));
    $("#actor-agent-account").focus();
    considerPreviewStatement();
    e.preventDefault();
});

$("#actor-group-account-example").click(function(e) {
    $("#actor-group-account").val(JSON.stringify(accountGroupExample, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});

$("#predefined-verb").change(function() {
    var $this = $(this);
    $("#verb-id").val($this.val());
    $("#verb-display").val($this.children(':selected').text());
});

$("#object-type").change(function() {
    var objectType = $(this).val();
    $("#object-types > div").hide();
    $("#object-types > #object-" + objectType).show();
});

$("#object-activity-interaction-type").change(function() {
    var objectActivityInteractionType = $(this).val();
    if (objectActivityInteractionType != "") {
      $("#object-activity-type").val("http://adlnet.gov/expapi/activities/cmi.interaction");
      $("#correct-responses-pattern").show();
    } else {
      $("#object-activity-type").val("");
      $("#correct-responses-pattern").hide();
    }
    $("#component-lists > div").hide();
    var componentLists = [];
    switch(objectActivityInteractionType) {
      case "choice":
        componentLists = ['choices'];
      break;
      case "sequencing":
        componentLists = ['choices'];
      break;
      case "likert":
        componentLists = ['scale'];
      break;
      case "matching":
        componentLists = ['source','target'];
      break;
      case "performance":
        componentLists = ['steps'];
      break;
      default:
      break;
    }
    $("#component-lists textarea").val("");
    $("#object-activity-correct-responses-pattern").val("");
    componentLists.forEach(function(e, i, a) {
      $("#component-lists > #component-list-" + e).show();
    });
});

$("#object-activity-component-list-choices-example").click(function(e) {
    $("#object-activity-component-list-choices").val(JSON.stringify(componentListChoicesExample, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});

$("#object-activity-component-list-scale-example").click(function(e) {
    $("#object-activity-component-list-scale").val(JSON.stringify(componentListScaleExample, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});

$("#object-activity-component-list-source-example").click(function(e) {
    $("#object-activity-component-list-source").val(JSON.stringify(componentListSourceExample, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});

$("#object-activity-component-list-target-example").click(function(e) {
    $("#object-activity-component-list-target").val(JSON.stringify(componentListTargetExample, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});

$("#object-activity-component-list-steps-example").click(function(e) {
    $("#object-activity-component-list-steps").val(JSON.stringify(componentListStepsExample, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});

$("#object-activity-correct-responses-pattern-example").click(function(e) {
    var interactionType = $("#object-activity-interaction-type").val();
    var exampleJSON = "";
    switch(interactionType) {
      case "choice":
        exampleJSON = correctResponsesPatternChoice;
      break;
      case "sequencing":
        exampleJSON = correctResponsesPatternSequencing;
      break;
      case "likert":
        exampleJSON = correctResponsesPatternLikert;
      break;
      case "matching":
        exampleJSON = correctResponsesPatternMatching;
      break;
      case "performance":
        exampleJSON = correctResponsesPatternPerformance;
      break;
      case "true-false":
        exampleJSON = correctResponsesPatternTrueFalse;
      break;
      case "fill-in":
        exampleJSON = correctResponsesPatternFillIn;
      break;
      case "long-fill-in":
        exampleJSON = correctResponsesPatternLongFillIn;
      break;
      case "numeric":
        exampleJSON = correctResponsesPatternNumeric;
      break;
      case "other":
        exampleJSON = correctResponsesPatternOther;
      break;
      default:
      break;
    }
    $("#object-activity-correct-responses-pattern").val(JSON.stringify(exampleJSON, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});

$("#object-agent-account-example").click(function(e) {
    $("#object-agent-account").val(JSON.stringify(accountAgentExample, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});

$("#object-group-account-example").click(function(e) {
    $("#object-group-account").val(JSON.stringify(accountGroupExample, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});

$(".duration-segment").change(function(e) {
    var resultDurationYears = $("#result-duration-years").val();
    var resultDurationMonths = $("#result-duration-months").val();
    var resultDurationWeeks = $("#result-duration-weeks").val();
    var resultDurationDays = $("#result-duration-days").val();
    var resultDurationHours = $("#result-duration-hours").val();
    var resultDurationMinutes = $("#result-duration-minutes").val();
    var resultDurationSeconds = $("#result-duration-seconds").val();
    var resultDurationMilliseconds = $("#result-duration-milliseconds").val();

    var duration = "P";
    if (resultDurationYears != "") { duration += resultDurationYears + "Y"; }
    if (resultDurationMonths != "") { duration += resultDurationMonths + "M"; }
    if (resultDurationWeeks != "") { duration += resultDurationWeeks + "W"; }
    if (resultDurationDays != "") { duration += resultDurationDays + "D"; }

    if (resultDurationHours != "" || resultDurationMinutes != "" || resultDurationSeconds != "" || resultDurationMilliseconds != "") { duration += "T"; }

    if (resultDurationHours != "") { duration += resultDurationHours + "H"; }
    if (resultDurationMinutes != "") { duration += resultDurationMinutes + "M"; }
    if (resultDurationSeconds != "" || resultDurationMilliseconds != "") {
      if (resultDurationSeconds == "" && resultDurationMilliseconds != "") { resultDurationSeconds = 0; }
      if (resultDurationMilliseconds.length == 1) { resultDurationMilliseconds = "0" + resultDurationMilliseconds; }
      if (resultDurationSeconds == "" || (resultDurationSeconds != "" && resultDurationMilliseconds != "")) { resultDurationMilliseconds = "." + resultDurationMilliseconds; }
      duration += resultDurationSeconds + resultDurationMilliseconds + "S";
    }

    $("#result-duration").val(duration);
});

$("#context-team-members-example").click(function(e) {
    $("#context-team-members").val(JSON.stringify(groupExample, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});

$("#context-context-activities-example").click(function(e) {
    $("#context-context-activities").val(JSON.stringify(contextActivitiesExample, undefined, 4));
    considerPreviewStatement();
    e.preventDefault();
});


/*  Statement Manipulation and Response -- Sending */

$("#generate-statement").click(function(e) {
    previewStatement();
    e.preventDefault();
});

// Try parsing JSON to validate it
$("#validate-json").click(function(e) {
    var r = validateJSON(editor.getValue());
    var whichNotificationSettings = (r == true) ? notificationSettings : notificationErrorSettings;
    var notificationStatus = (r == true) ? "JSON is valid" : "JSON is <em>NOT</em> valid";
    notify({ message: notificationStatus }, whichNotificationSettings);
    btnValidateJSON(r);
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

$("#send-activity-profile").click(function(e) {
    sendActivityProfile();
    e.preventDefault();
});

$("#send-agent-profile").click(function(e) {
    sendAgentProfile();
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

$("#get-activity-profile").click(function(e) {
    getActivityProfile();
    e.preventDefault();
});

$("#get-agent-profile").click(function(e) {
    getAgentProfile();
    e.preventDefault();
});

$("#clear-received-documents").click(function(e) {
    clearReceivedDocuments();
    e.preventDefault();
});


/*  Document Manipulation and Response -- Deleting */

$("#delete-state").click(function(e) {
    deleteState();
    e.preventDefault();
});

$("#delete-activity-profile").click(function(e) {
    deleteActivityProfile();
    e.preventDefault();
});

$("#delete-agent-profile").click(function(e) {
    deleteAgentProfile();
    e.preventDefault();
});

$("#clear-deleted-documents").click(function(e) {
    clearDeletedDocuments();
    e.preventDefault();
});

/* Endpoint */

$("#endpoint-values").validator();

// Update statement viewer links to pass auth via query string
$("#endpoint-values").keyup(function() {
    var root = $(".statement-viewer").attr("rel");
    console.log(root);
    var endpoint = $("#endpoint").val();
    var username = $("#username").val();
    var password = $("#password").val();
    var auth = "Basic%20" + toBase64(username + ":" + password);
    $(".statement-viewer").attr("href", root + "?endpoint=" + endpoint + "&auth=" + auth);
});

/*
 * Functions
 */
 
// Helper Functions

// Form Validation
function validateAgentIFI(div) {
    var inputs = $('input, textarea', div + ' .ifi').filter(function() {
        return $.trim( this.value ).length > 0;
    });

    // console.log(inputs)
    // console.log(inputs.length);
    if (inputs.length > 1) { return false; }
    return true;
}

function validateGroupIFI(div, members) {
    var inputs = $('input, textarea', div + ' .ifi').filter(function() {
        return $.trim( this.value ).length > 0;
    });

    //console.log(inputs.length);
    if (inputs.length == 0 && $(members).val() == "") { return false; }
    if (inputs.length > 1) { return false; }
    return true;
}

// Notification
function notify(message, settings) {
  // message is a JSON object with message and optional title
  $.notify(message, settings);
  if (message.hasOwnProperty('title')) {
      message.message = message.title + "<br>" + message.message;
  }
  var curDate = moment().format('MM-DD-YYYY HH:mm:ssa');
  $("#console-history").prepend('<div class="alert alert-' + settings.type + ' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message.message + '<br /><small>' + curDate + '</small></div>');
  $("#console-history").prepend();
}

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
    var actorType = $("#actor-type").val();
    var actorAgentEmail = $("#actor-agent-email").val();
    var actorAgentEmailSha1 = $("#actor-agent-email-sha1").val();
    var actorAgentOpenID = $("#actor-agent-openid").val();
    var actorAgentAccount = $("#actor-agent-account").val();
    var actorAgentName = $("#actor-agent-name").val();
    var actorGroupEmail = $("#actor-group-email").val();
    var actorGroupEmailSha1 = $("#actor-group-email-sha1").val();
    var actorGroupOpenID = $("#actor-group-openid").val();
    var actorGroupAccount = $("#actor-group-account").val();
    var actorGroupName = $("#actor-group-name").val();
    var actorGroupMembers = $("#actor-group-members").val();
    var verbID = $("#verb-id").val();
    var verbDisplay = $("#verb-display").val();
    var verbLanguage = $("#verb-language").val();
    var objectType = $("#object-type").val();
    var objectActivityID = $("#object-activity-id").val();
    var objectActivityName = $("#object-activity-name").val();
    var objectActivityDescription = $("#object-activity-description").val();
    var objectActivityLanguage = $("#object-activity-language").val();
    var objectActivityType = $("#object-activity-type").val();
    var objectActivityMoreInfo = $("#object-activity-more-info").val();
    var objectActivityInteractionType = $("#object-activity-interaction-type").val();
    var objectActivityComponentListChoices = $("#object-activity-component-list-choices").val();
    var objectActivityComponentListScale = $("#object-activity-component-list-scale").val();
    var objectActivityComponentListSource = $("#object-activity-component-list-source").val();
    var objectActivityComponentListTarget = $("#object-activity-component-list-target").val();
    var objectActivityComponentListSteps = $("#object-activity-component-list-steps").val();
    var objectActivityCorrectResponsesPattern = $("#object-activity-correct-responses-pattern").val();
    var objectActivityExtensions = $("#object-activity-extensions").val();
    var objectAgentEmail = $("#object-agent-email").val();
    var objectAgentEmailSha1 = $("#object-agent-email-sha1").val();
    var objectAgentOpenID = $("#object-agent-openid").val();
    var objectAgentAccount = $("#object-agent-account").val();
    var objectAgentName = $("#object-agent-name").val();
    var objectGroupEmail = $("#object-group-email").val();
    var objectGroupEmailSha1 = $("#object-group-email-sha1").val();
    var objectGroupOpenID = $("#object-group-openid").val();
    var objectGroupAccount = $("#object-group-account").val();
    var objectGroupName = $("#object-group-name").val();
    var objectGroupMembers = $("#object-group-members").val();
    var objectStatementRef = $("#object-statementref-id").val();
    var objectSubStatement = $("#object-substatement-json").val();
    var resultScaledScore = $("#result-scaled-score").val();
    var resultRawScore = $("#result-raw-score").val();
    var resultMinScore = $("#result-min-score").val();
    var resultMaxScore = $("#result-max-score").val();
    var resultSuccess = $("#result-success").val();
    var resultCompletion = $("#result-completion").val();
    var resultResponse = $("#result-response").val();
    var resultDuration = $("#result-duration").val();
    var resultExtensions = $("#result-extensions").val();
    var contextRegistrationID = $("#context-registration-id").val();
    var contextInstructorEmail = $("#context-instructor-email").val();
    var contextInstructorName = $("#context-instructor-name").val();
    var contextTeamName = $("#context-team-name").val();
    var contextTeamMembers = $("#context-team-members").val();
    var contextContextActivities = $("#context-context-activities").val();
    var contextRevision = $("#context-revision").val();
    var contextPlatform = $("#context-platform").val();
    var contextLanguage = $("#context-language").val();
    var contextStatement = $("#context-statement").val();
    var contextExtensions = $("#context-extensions").val();
    var attachmentUsageType = $("#attachment-usage-type").val();
    var attachmentDisplay = $("#attachment-display").val();
    var attachmentDescription = $("#attachment-description").val();
    var attachmentLanguage = $("#attachment-language").val();
    var attachmentContentType = $("#attachment-content-type").val();
    var attachmentLength = $("#attachment-length").val();
    var attachmentSha2 = $("#attachment-sha2").val();
    var attachmentFileURL = $("#attachment-file-url").val();
    var statementTimestamp = $("#statement-timestamp input").val();
    var statementID = $("#statement-id").val();
    var statementVersion = $("#statement-version").val();

    var stmt = {};

    if (statementTimestamp != "") { stmt['timestamp'] = moment(new Date(statementTimestamp)).format(); }
    if (statementID != "") { stmt['id'] = statementID; }
    if (statementVersion != "") { stmt['version'] = statementVersion; }

    stmt['actor'] = {};
    switch(actorType) {
      case "Agent":
        // LRS will reject if more than one IFI is in the statement
        if (actorAgentEmail != "") { stmt['actor']['mbox'] = "mailto:" + actorAgentEmail; }
        if (actorAgentEmailSha1 != "") { stmt['actor']['mbox_sha1sum'] = actorAgentEmailSha1; }
        if (actorAgentOpenID != "") { stmt['actor']['openid'] = actorAgentOpenID; }
        if (actorAgentAccount != "") { stmt['actor']['account'] = $.parseJSON(actorAgentAccount); }
        if (actorAgentName != "") { stmt['actor']['name'] = actorAgentName; }
        stmt['actor']['objectType'] = "Agent";
        break;
      case "Group":
        if (actorGroupEmail != "") { stmt['actor']['mbox'] = "mailto:" + actorGroupEmail; }
        if (actorGroupEmailSha1 != "") { stmt['actor']['mbox_sha1sum'] = actorGroupEmailSha1; }
        if (actorGroupOpenID != "") { stmt['actor']['openid'] = actorGroupOpenID; }
        if (actorGroupAccount != "") { stmt['actor']['account'] = $.parseJSON(actorGroupAccount); }
        if (actorGroupName != "") { stmt['actor']['name'] = actorGroupName; }
        if (actorGroupMembers != "") { stmt['actor']['member'] = $.parseJSON(actorGroupMembers); }
        break;
      default:
    }
    
    stmt['actor']['objectType'] = actorType;

    stmt['verb'] = {};
    stmt['verb']['id'] = verbID;
    stmt['verb']['display'] = {};
    stmt['verb']['display'][verbLanguage] = verbDisplay;
    stmt['object'] = {};

    switch(objectType) {
      case "Activity":
        stmt['object']['id'] = objectActivityID;
        if (/.+/.test([ objectActivityName, objectActivityDescription, objectActivityType, objectActivityMoreInfo, objectActivityExtensions ].join(""))) {
            stmt['object']['definition'] = {};
        }
        if (objectActivityName != "" && objectActivityLanguage != "") {
            stmt['object']['definition']['name'] = {};
            stmt['object']['definition']['name'][objectActivityLanguage] = objectActivityName;
        }
        if (objectActivityDescription != "" && objectActivityLanguage != "") {
            stmt['object']['definition']['description'] = {};
            stmt['object']['definition']['description'][objectActivityLanguage] = objectActivityDescription;
        }
        if (objectActivityType != "") { stmt['object']['definition']['type'] = objectActivityType; }
        if (objectActivityMoreInfo != "") { stmt['object']['definition']['moreInfo'] = objectActivityMoreInfo; }
        if (objectActivityInteractionType != "") { stmt['object']['definition']['interactionType'] = objectActivityInteractionType; }
        if (objectActivityComponentListChoices != "") { stmt['object']['definition']['choices'] = $.parseJSON(objectActivityComponentListChoices); }
        if (objectActivityComponentListScale != "") { stmt['object']['definition']['scale'] = $.parseJSON(objectActivityComponentListScale); }
        if (objectActivityComponentListSource != "") { stmt['object']['definition']['source'] = $.parseJSON(objectActivityComponentListSource); }
        if (objectActivityComponentListTarget != "") { stmt['object']['definition']['target'] = $.parseJSON(objectActivityComponentListTarget); }
        if (objectActivityComponentListSteps != "") { stmt['object']['definition']['steps'] = $.parseJSON(objectActivityComponentListSteps); }
        if (objectActivityCorrectResponsesPattern != "") { stmt['object']['definition']['correctResponsesPattern'] = $.parseJSON(objectActivityCorrectResponsesPattern); }
        if (objectActivityExtensions != "") { stmt['object']['definition']['extensions'] = $.parseJSON(objectActivityExtensions); }
        break;
      case "Agent":
        // LRS will reject if more than one IFI is in the statement
        if (objectAgentEmail != "") { stmt['object']['mbox'] = "mailto:" + objectAgentEmail; }
        if (objectAgentEmailSha1 != "") { stmt['object']['mbox_sha1sum'] = objectAgentEmailSha1; }
        if (objectAgentOpenID != "") { stmt['object']['openid'] = objectAgentOpenID; }
        if (objectAgentAccount != "") { stmt['object']['account'] = $.parseJSON(objectAgentAccount); }
        if (objectAgentName != "") { stmt['object']['name'] = objectAgentName; }
        stmt['object']['objectType'] = "Agent";
        break;
      case "Group":
        if (objectGroupEmail != "") { stmt['object']['mbox'] = "mailto:" + objectGroupEmail; }
        if (objectGroupEmailSha1 != "") { stmt['object']['mbox_sha1sum'] = objectGroupEmailSha1; }
        if (objectGroupOpenID != "") { stmt['object']['openid'] = objectGroupOpenID; }
        if (objectGroupAccount != "") { stmt['object']['account'] = $.parseJSON(objectGroupAccount); }
        if (objectGroupName != "") { stmt['object']['name'] = objectGroupName; }
        if (objectGroupMembers != "") { stmt['object']['member'] = $.parseJSON(objectGroupMembers); }
        break;
      case "StatementRef":
        stmt['object']['id'] = objectStatementRef;
        break;
      case "SubStatement":
        stmt['object'] = $.parseJSON(objectSubStatement);
        break;
      default:
    }
    
    stmt['object']['objectType'] = objectType;

    if (/.+/.test([ resultScaledScore, resultRawScore, resultMinScore, resultMaxScore, resultSuccess, resultCompletion, resultResponse, resultDuration, resultExtensions ].join(""))) {
        stmt['result'] = {};
        if ( resultScaledScore != "" || resultRawScore != "" || resultMinScore != "" || resultMaxScore != "" ) {
            stmt['result']['score'] = {};
            if (resultScaledScore != "") { stmt['result']['score']['scaled'] = parseFloat(resultScaledScore); }
            if (resultRawScore != "") { stmt['result']['score']['raw'] = parseInt(resultRawScore); }
            if (resultMinScore != "") { stmt['result']['score']['min'] = parseInt(resultMinScore); }
            if (resultMaxScore != "") { stmt['result']['score']['max'] = parseInt(resultMaxScore); }
        }
        if (resultSuccess != "") { stmt['result']['success'] = (resultSuccess === 'true'); }
        if (resultCompletion != "") { stmt['result']['completion'] = (resultCompletion === 'true'); }
        if (resultResponse != "") { stmt['result']['response'] = resultResponse; }
        if (resultDuration != "") { stmt['result']['duration'] = resultDuration; }
        if (resultExtensions != "") { stmt['result']['extensions'] = $.parseJSON(resultExtensions); }
    }

    if (/.+/.test([ contextRegistrationID, contextInstructorEmail, contextInstructorName, contextTeamName, contextTeamMembers, contextContextActivities, contextRevision, contextPlatform, contextLanguage, contextStatement, contextExtensions ].join(""))) {
        stmt['context'] = {};
        if (contextRegistrationID != "") { stmt['context']['registration'] = contextRegistrationID; }
        if (contextInstructorEmail != "" || contextInstructorName != "") {
            stmt['context']['instructor'] = {};
            if (contextInstructorEmail != "") { stmt['context']['instructor']['mbox'] = "mailto:" + contextInstructorEmail; }
            if (contextInstructorName != "") { stmt['context']['instructor']['name'] = contextInstructorName; }
        }
        if (contextTeamName != "" || contextTeamMembers != "") { // This is going to need to support more formats
            stmt['context']['team'] = {};
            if (contextTeamName != "") { stmt['context']['team']['name'] = contextTeamName; }
            if (contextTeamMembers != "") { stmt['context']['team']['member'] = $.parseJSON(contextTeamMembers); }
            stmt['context']['team']['objectType'] = "Group";
        }
        if (contextContextActivities != "") { // The user must know where they are doing here
            stmt['context']['contextActivities'] = $.parseJSON(contextContextActivities);
        }
        if (contextRevision != "") { stmt['context']['revision'] = contextRevision; }
        if (contextPlatform != "") { stmt['context']['platform'] = contextPlatform; }
        if (contextLanguage != "") { stmt['context']['language'] = contextLanguage; }
        if (contextStatement != "") {
            stmt['context']['statement']['id'] = contextStatement;
            stmt['context']['statement']['objectType'] = "Group";
        }
        if (contextExtensions != "") { stmt['context']['extensions'] = $.parseJSON(contextExtensions); }
    }

    if (/.+/.test([ attachmentDisplay, attachmentDescription, attachmentLanguage, attachmentContentType, attachmentLength, attachmentSha2, attachmentFileURL ].join(""))) {
      stmt['attachments'] = [];
      var attachment = {};
      attachment['usageType'] = attachmentUsageType;
      if (attachmentDisplay != "" && attachmentLanguage != "") {
          attachment['display'] = {};
          attachment['display'][attachmentLanguage] = attachmentDisplay;
      }
      if (attachmentDescription != "" && attachmentLanguage != "") {
          attachment['description'] = {};
          attachment['description'][attachmentLanguage] = attachmentDescription;
      }      
      attachment['contentType'] = attachmentContentType;
      attachment['length'] = parseInt(attachmentLength);
      attachment['sha2'] = attachmentSha2;
      if (attachmentFileURL != "") { attachment['fileUrl'] = attachmentFileURL; }
      stmt['attachments'].push(attachment);
    }

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

// Change the class of the JSON Button
function btnValidateJSON(bool) {
    if (bool != true)
        $("#validate-json").removeClass("btn-success").addClass("btn-danger");
    else
        $("#validate-json").removeClass("btn-danger").addClass("btn-success");
}

/*  Statement Manipulation and Response -- Sending */

// Generate statement and preview in the editor
function previewStatement() {
    var stmt = buildStatement();

    editor.setValue(JSON.stringify(stmt, undefined, 4)); // or session.setValue
    editor.clearSelection(); // or session.setValue
}

// Generate statement and preview in the editor if "automatically build is true
function considerPreviewStatement() {
    if ($("#automatically-build").is(':checked')) {
        previewStatement();
    }
}

// Send statement to the LRS
function sendStatement() {
    setupConfig();

    var stmt = editor.getValue(); // or session.getValue

    if (validateJSON(stmt) != true) { // JSON is invalid
        notify({ message: "invalid JSON, cannot send" }, notificationErrorSettings);
        return false;
    }

    var xstmt = $.parseJSON(stmt);

    ADL.XAPIWrapper.sendStatement(xstmt, function(r, obj) {
        console.log(r);
        //console.log(obj);
        // notification
        if (r.status == 200) {
            notify({ title: "Status " + r.status + " " + r.statusText + ": ", message: "<b><em>" + xstmt.verb.display['en-US'] + "</em></b> statement sent successfully to LRS" }, notificationSettings);
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
        notify({ message: "invalid JSON, cannot add to queue" }, notificationErrorSettings);
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

    //var xstmts = $.parseJSON(stmts);

    ADL.XAPIWrapper.sendStatements(stmts, function(r, obj) {
        //console.log(r);
        //console.log(obj);
        // notification
        if (r.status == 200) {
            notify({ title: "Status " + r.status + " " + r.statusText + ": ", message: "<b><em>Statement Queue</em></b> sent successfully to LRS" }, notificationSettings);
            //console.log(r, obj);

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

// Pretty view of statement
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

    var verbSort = $("#search-verb-sort").val();
    var verbId = $("#search-user-verb-id").val();
    var actorEmail = $("#search-actor-email").val();
    var activityId = $("#search-activity-id").val();
    var relatedAgents = $("#search-related-agents").val();
    var relatedActivities = $("#search-related-activities").val();
    var registrationId = $("#search-registration-id").val();
    var statementId = $("#search-statement-id").val();
    var voidedStatementId = $("#search-voided-statement-id").val();
    var sinceDate = $("#search-statements-since-date input").val();
    var untilDate = $("#search-statements-until-date input").val();
    var limit = $("#search-limit").val();

    // Build Search
    var search = ADL.XAPIWrapper.searchParams();
    if (verbId != "") { search['verb'] = verbId; }
    if (verbSort != "") { search['ascending'] = verbSort; }
    if (actorEmail != "") { search['agent'] = JSON.stringify({ "mbox": "mailto:" + actorEmail}); }
    if (activityId != "") { search['activity'] = activityId; }
    if (relatedAgents != "") { search['related_agents'] = relatedAgents; }
    if (relatedActivities != "") { search['related_activities'] = relatedActivities; }
    if (registrationId != "") { search['registration'] = registrationId; }
    if (statementId != "") { search['statementId'] = statementId; }
    if (voidedStatementId != "") { search['voidedStatementId'] = voidedStatementId; }
    if (sinceDate != "") { search['since'] = sinceDate; }
    if (untilDate != "") { search['until'] = untilDate; }
    if (limit != "") { search['limit'] = limit; }
    //console.log(search);

    ADL.XAPIWrapper.getStatements(search, null, function(r) {
        //console.log(r);
        var response = $.parseJSON(r.response);

        // notification
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

            notify({ title: "Status " + r.status + " " + r.statusText + ": ", message: "statements received successfully from LRS" }, notificationSettings);

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

// Send State to the LRS
function sendState() {
    setupConfig();

    var activityId = $("#document-activity-id").val();
    var actorEmail = $("#document-actor-email").val(); // TODO: Agent
    var stateId = $("#set-document-state-id").val();
    // registration    
    var stateValue = $("#set-document-state-string").val();
    // matchHash
    // noneMatchHash
    // callback

    ADL.XAPIWrapper.sendState(activityId, {"mbox":"mailto:" + actorEmail}, stateId, null, stateValue, null, null, function(r) {
        notify({ message: "Status " + r.status + " " + r.statusText }, notificationSettings);
        //$("#sent-documents").append("<p>Sent State <b>" + stateId + "</b>: " + stateValue + "</p>");
        if (validateJSON(stateValue) == true) {
          stateValue = JSON.stringify($.parseJSON(stateValue), undefined, 4);
        }
        $("#sent-documents").append(styleDocumentsView("State: " + stateId, stateValue));
        if (validateJSON(stateValue) == true) {
          PR.prettyPrint();
        }
        console.log(r);
    });
}

// Sent Activity Profile to the LRS
function sendActivityProfile() {
    setupConfig();

    var activityId = $("#document-activity-id").val();
    var profileId = $("#set-document-activity-profile-id").val();
    var profileValue = $("#set-document-activity-profile-string").val();
    // matchHash
    // noneMatchHash
    // callback

    ADL.XAPIWrapper.sendActivityProfile(activityId, profileId, profileValue, null, "*", function(r) {
        notify({ message: "Status " + r.status + " " + r.statusText }, notificationSettings);
        //$("#sent-documents").append("<p>Sent Activity Profile <b>" + profileId + "</b>: " + profileValue + "</p>");
        if (validateJSON(profileValue) == true) {
          profileValue = JSON.stringify($.parseJSON(profileValue), undefined, 4);
        }
        $("#sent-documents").append(styleDocumentsView("Activity Profile: " + profileId, profileValue));
        if (validateJSON(profileValue) == true) {
          PR.prettyPrint();
        }
        console.log(r);
    });
}

// Sent Activity Profile to the LRS
function sendAgentProfile() {
    setupConfig();

    var actorEmail = $("#document-actor-email").val(); // TODO: Agent
    var profileId = $("#set-document-agent-profile-id").val();
    var profileValue = $("#set-document-agent-profile-string").val();
    // matchHash
    // noneMatchHash
    // callback

    ADL.XAPIWrapper.sendAgentProfile({"mbox":"mailto:" + actorEmail}, profileId, profileValue, null, "*", function(r) {
        notify({ message: "Status " + r.status + " " + r.statusText }, notificationSettings);
        //$("#sent-documents").append("<p>Sent Agent Profile <b>" + profileId + "</b>: " + profileValue + "</p>");
        if (validateJSON(profileValue) == true) {
          profileValue = JSON.stringify($.parseJSON(profileValue), undefined, 4);
        }
        $("#sent-documents").append(styleDocumentsView("Agent Profile: " + profileId, profileValue));
        if (validateJSON(profileValue) == true) {
          PR.prettyPrint();
        }
        console.log(r);
    });
}

function clearSentDocuments() {
    $("#sent-documents").html("");
}



/*  Document Manipulation and Response -- Receiving */

// Get State from the LRS
function getState() {
    setupConfig();

    var activityId = $("#document-activity-id").val();
    var actorEmail = $("#document-actor-email").val(); // TODO: Agent
    var stateId = $("#get-document-state-id").val();
    // registration
    var since = $("#get-document-since-date input").val();
    var sinceDate = (since == "") ? null : new Date(since);
    // callback

    ADL.XAPIWrapper.getState(activityId, {"mbox":"mailto:" + actorEmail}, stateId, null, sinceDate, function(r) {
        if (r.status == 404)
          notify({ message: "Status " + r.status + " " + r.statusText }, notificationWarningSettings);
        else
          notify({ message: "Status " + r.status + " " + r.statusText }, notificationSettings);
        //$("#received-documents").append("<p>Received State <b>" + stateId + "</b>: " + r.response + "</p>");
        if (validateJSON(r.response) != true) {
          var stateValue = r.response;
        } else {
          var stateValue = JSON.stringify($.parseJSON(r.response), undefined, 4);
        }
        $("#received-documents").append(styleDocumentsView("State: " + stateId, stateValue));
        if (validateJSON(r.response) == true) {
          PR.prettyPrint();
        }
        console.log(r);
    });
}

// Get Activity Profile from the LRS
function getActivityProfile() {
    setupConfig();

    var activityId = $("#document-activity-id").val();
    var profileId = $("#get-document-activity-profile-id").val();
    var since = $("#get-document-since-date input").val();
    var sinceDate = (since == "") ? null : new Date(since);
    // callback

    ADL.XAPIWrapper.getActivityProfile(activityId, profileId, sinceDate, function(r) {
        if (r.status == 404)
          notify({ message: "Status " + r.status + " " + r.statusText }, notificationWarningSettings);
        else
          notify({ message: "Status " + r.status + " " + r.statusText }, notificationSettings);
        //$("#received-documents").append("<p>Received Activity Profile <b>" + profileId + "</b>: " + r.response + "</p>");
        if (validateJSON(r.response) != true) {
          var profileValue = r.response;
        } else {
          var profileValue = JSON.stringify($.parseJSON(r.response), undefined, 4);
        }
        $("#received-documents").append(styleDocumentsView("Activity Profile: " + profileId, profileValue));
        if (validateJSON(r.response) == true) {
          PR.prettyPrint();
        }
        console.log(r);
    });
}

// Get Agent Profile from the LRS
function getAgentProfile() {
    setupConfig();

    var actorEmail = $("#document-actor-email").val(); // TODO: Agent
    var profileId = $("#get-document-agent-profile-id").val();
    var since = $("#get-document-since-date input").val();
    var sinceDate = (since == "") ? null : new Date(since);
    // callback

    ADL.XAPIWrapper.getAgentProfile({"mbox":"mailto:" + actorEmail}, profileId, sinceDate, function(r) {
        if (r.status == 404)
          notify({ message: "Status " + r.status + " " + r.statusText }, notificationWarningSettings);
        else
          notify({ message: "Status " + r.status + " " + r.statusText }, notificationSettings);
        //$("#received-documents").append("<p>Received Agent Profile <b>" + profileId + "</b>: " + r.response + "</p>");
        if (validateJSON(r.response) != true) {
          var profileValue = r.response;
        } else {
          var profileValue = JSON.stringify($.parseJSON(r.response), undefined, 4);
        }
        $("#received-documents").append(styleDocumentsView("Agent Profile: " + profileId, profileValue));
        if (validateJSON(r.response) == true) {
          PR.prettyPrint();
        }
        console.log(r);
    });
}

// Pretty view of statements
function styleDocumentsView(id, value) {
    var rand = Math.random().toString(36).substr(2, 5);
    var newId = id.replace(/[: ]/g, "");
    return '<div class="panel panel-primary"><div class="panel-heading collapser"><h4 class="panel-title"><a data-toggle="collapse" data-target="#' + rand + newId + '" href="#' + rand + newId + '">' + id + '</a></h4></div><div id="' + rand + newId + '" class="panel-collapse collapse in"><div class="panel-body"><pre class="prettyprint lang-js" >' + value + '</pre></div></div></div>';
}

function clearReceivedDocuments() {
    $("#received-documents").html("");
}


/*  Document Manipulation and Response -- Deleting */

// Delete State from the LRS
function deleteState() {
    setupConfig();

    var activityId = $("#document-activity-id").val();
    var actorEmail = $("#document-actor-email").val(); // TODO: Agent
    var stateId = $("#delete-document-state-id").val();
    // registration
    // matchHash
    // noneMatchHash
    // callback

    ADL.XAPIWrapper.deleteState(activityId, {"mbox":"mailto:" + actorEmail}, stateId, null, null, null, function(r) {
        notify({ message: "Status " + r.status + " " + r.statusText }, notificationSettings);
        if (r.status == 204) {
            $("#deleted-documents").append("<p>Deleted State: <b>" + stateId + "</b></p>");
        }
        console.log(r);
    });
}

// Delete Activity Profile from the LRS
function deleteActivityProfile() {
    setupConfig();

    var activityId = $("#document-activity-id").val();
    var profileId = $("#delete-document-activity-profile-id").val();
    // matchHash
    // noneMatchHash
    // callback

    ADL.XAPIWrapper.deleteActivityProfile(activityId, profileId, null, null, function(r) {
        notify({ message: "Status " + r.status + " " + r.statusText }, notificationSettings);
        if (r.status == 204) {
            $("#deleted-documents").append("<p>Deleted Activity Profile: <b>" + profileId + "</b></p>");
        }
        console.log(r);
    });
}

// Delete Agent Profile from the LRS
function deleteAgentProfile() {
    setupConfig();

    var actorEmail = $("#document-actor-email").val(); // TODO: Agent
    var profileId = $("#delete-document-agent-profile-id").val();
    // matchHash
    // noneMatchHash
    // callback

    ADL.XAPIWrapper.deleteAgentProfile({"mbox":"mailto:" + actorEmail}, profileId, null, null, function(r) {
        notify({ message: "Status " + r.status + " " + r.statusText }, notificationSettings);
        $("#deleted-documents").append("<p>" + r.response + "</p>");
        if (r.status == 204) {
            $("#deleted-documents").append("<p>Deleted Agent Profile: <b>" + profileId + "</b></p>");
        }
    });
}

function clearDeletedDocuments() {
    $("#deleted-documents").html("");
}
