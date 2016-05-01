var q = require('q');
var google = require('googleapis');
var googleAuth = require('./../lib/googleAuth');

function CalendarHelper() {}

CalendarHelper.prototype.getFreeTime = function(params) {
  var deferred = q.defer();
  
  var auth = googleAuth.getAuth(params.calendarId);
  listEvents(auth, params, function(err, response) {
    if (err) {
       console.log(err);
       deferred.reject(new Error(err));
    } else {
      deferred.resolve(response);
    }
  });
  return deferred.promise;
}

CalendarHelper.prototype.addEvent = function(params) {
  var deferred = q.defer();
  
  //console.log("Adding event to: " + params.calendar[0]);
  var auth = googleAuth.getAuth("goldenfreedomcoders");
  insertEvent(auth, params, function(err, response) {
    if (err) {
      console.log("Error: " + err);
      deferred.reject(new Error(err));
    }
    else {
      console.log(response);
      deferred.resolve(response);
    }
  });
  return deferred.promise;
}

CalendarHelper.prototype.freeBusy = function(resource) {
  var deferred = q.defer();
  
  var auth = googleAuth.getAuth("goldenfreedomcoders");
  var calendar = google.calendar('v3');
  calendar.freebusy.query({
    auth: auth,
    resource: resource
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      deferred.reject(err);
      return;
    }
    
    console.log(JSON.stringify(response));
    deferred.resolve(response);
  });
  
  return deferred.promise;
}


function listEvents(auth, params, callback) {
  var calendar = google.calendar('v3');
  var minTime = (new Date(params.timeMin)).toISOString();
  if (params.timeMax)
  console.log("list Even Param---->" + JSON.stringify(params));
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: minTime,
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, callback);
}

function insertEvent(auth,param, callback) {
    var event = {
    'summary': 'Meet with Ben',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'Enjoy your time @pixel.',
    'start': {
      'dateTime': param.timeMin.toISOString(),
      'timeZone': "America/Los_Angeles"
    },
    'end': {
      'dateTime': param.timeMax.toISOString(),
            'timeZone': "America/Los_Angeles"
     
    },
    'attendees': [
      {'email': 'lpage@example.com'},
      {'email': 'sbrin@example.com'},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };


console.log("Add Event Input" + JSON.stringify(event));
  var calendar = google.calendar('v3');
  calendar.events.insert({
    auth: auth,
    calendarId: "goldenfreedomcoders@gmail.com",
    resource: event,
  }, callback);
}
module.exports = CalendarHelper;
