var q = require('q');
var google = require('googleapis');
var googleAuth = require('./../lib/googleAuth');

function EmailHelper() {}

EmailHelper.prototype.getFreeTime = function(params) {
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

EmailHelper.prototype.addEvent = function(params) {
  var deferred = q.defer();
  
  console.log("Adding event to: " + params.calendar[0]);
  var auth = googleAuth.getAuth(params.calendar[0]);
  insertEvent(auth, function(err, response) {
    if (err) {
      console.log("Error: " + err);
      deferred.reject(new Error(err));
    }
    else {
      deferred.resolve(response);
    }
  });
  return deferred.promise;
}




function listEvents(auth, params, callback) {
  var calendar = google.calendar('v3');
  var minTime = "Time Min Sent to Google: " (new Date(params.timeMin)).toISOString();
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: minTime,
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, callback);
}

function insertEvent(auth, callback) {
    var event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2016-04-30T09:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': '2016-04-30T17:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
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

  var calendar = google.calendar('v3');
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  }, callback);
}
module.exports = EmailHelper;
