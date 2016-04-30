var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('./../lib/googleAuth');

function CalendarHelper() {}

CalendarHelper.prototype.getFreeTime = function(params, callback) {
  console.log(params.calendar[0]);
  console.log(params.calendar[1]);
  console.log(new Date(params.timeMin).toISOString());
  console.log(new Date(params.timeMax).toISOString());
  var auth = googleAuth.getAuth(params.calendar[0]);
  //authorize(JSON.parse(content), listEvents);
  listEvents(auth, params.calendar[0], callback);
  // callback(null, true);
}

CalendarHelper.prototype.hasFreeTime = function() {
  return 0;
};


function listEvents(auth, calendarId, callback) {
  var calendar = google.calendar('v3');
  console.log("hi hi hi ");
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {
      console.log('Upcoming 10 events:');
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        console.log('%s - %s', start, event.summary);
      }
    }
    
    callback(null, true);
  });
}

module.exports = CalendarHelper;
