var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var CalendarHelper = require('./../lib/calendarHelper');

describe('CalendarHelper', function() {
  it('getFreeTime for goldenfreedomcoders', function() {
    var calendarId = "goldenfreedomcoders";
    var helper = new CalendarHelper();
    var params = {
      calendarId: calendarId,
      timeMin: "2016-04-30",
      timeMax: '2016-04-21'
    };
    
    var testPromise = helper.getFreeTime(params);

    return testPromise.then(function(result) {
      var events = result.items;
      if (events.length == 0) {
        console.log('[' + calendarId + '] No upcoming events found.');
      } else {
        console.log('[' + calendarId + '] Upcoming 10 events:');
        for (var i = 0; i < events.length; i++) {
          var event = events[i];
          var start = event.start.dateTime || event.start.date;
          console.log('%s - %s', start, event.summary);
        }
      }
      
      expect(result).to.not.equal(null);
    });
  }),
  
  it('getFreeTime for innojam2016', function() {
    var calendarId = "innojam2016";
    var helper = new CalendarHelper();
    var params = {
      calendarId: calendarId,
      timeMin: "2016-04-30",
      timeMax: '2016-04-21'
    };

    var testPromise = helper.getFreeTime(params);

    return testPromise.then(function(result) {
      var events = result.items;
      if (events.length == 0) {
        console.log('[' + calendarId + '] No upcoming events found.');
      } else {
        console.log('[' + calendarId + '] Upcoming 10 events:');
        for (var i = 0; i < events.length; i++) {
          var event = events[i];
          var start = event.start.dateTime || event.start.date;
          console.log('%s - %s', start, event.summary);
        }
      }
      
      expect(result).to.not.equal(null);
    });
  }),
  
  it('freeTime for goldenfreedomcoders & innojam2016', function() {
    var calendarId = "goldenfreedomcoders";
    var helper = new CalendarHelper();
    var resource = {
      timeMin: "2016-05-01T00:00:00.000-05:00",
      timeMax: "2016-05-02T12:00:00.000-05:00",
      items: [{
        id: "goldenfreedomcoders@gmail.com"
      }, {
        id: "innojam2016@gmail.com"
      }]
    };
    
    var testPromise = helper.freeBusy(resource);

    return testPromise.then(function(result) {
     
      expect(result.kind).to.equal("calendar#freeBusy");
    });
  }),
  
  it('insertEvent', function() {
    var helper = new CalendarHelper();
    var params = {
      calendar: ["goldenfreedomcoders", "innojam2016"],
      timeMin: "2016-04-30",
      timeMax: '2016-04-21'
    };

    var testPromise = helper.addEvent(params);

    return testPromise.then(function(result) {
      expect(result).to.not.equal(null);
    });
  })
});


