//var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('./../lib/googleAuth');

function CalendarHelper() {}

CalendarHelper.prototype.getFreeTime = function(params, callback) {
  // console.log(params.calendar[0]);
  // console.log(params.calendar[1]);
  // console.log(new Date(params.timeMin).toISOString());
  // console.log(new Date(params.timeMax).toISOString());
  var auth = googleAuth.getAuth(params.calendar[0]);
  listEvents(auth, callback);
}

CalendarHelper.prototype.addEvent = function(params, callback) {
  console.log("Adding event to: " + params.calendar[0]);
  var auth = googleAuth.getAuth(params.calendar[0]);
  insertEvent(auth, callback);
}

CalendarHelper.prototype.hasFreeTime = function() {
  return 0;
};

function listEvents(auth, callback) {
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
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
module.exports = CalendarHelper;
