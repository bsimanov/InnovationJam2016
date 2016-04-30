var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var CalendarHelper = require('./../lib/calendarHelper');

describe('CalendarHelper', function() {
  it('First test', function() {
    var helper = new CalendarHelper();
    expect(helper.hasFreeTime()).to.equal(0);
  }),
  
  it('getFreeTime', function() {
    var helper = new CalendarHelper();
    var params = {
      calendar: ["goldenfreedomcoders", "innojam2016"],
      timeMin: "2016-04-30",
      timeMax: '2016-04-21'
    };

    var testPromise = new Promise(function(resolve, reject) {
      helper.getFreeTime(params, function(err, response) {
        if (err) {
          console.log("Error: " + err);
          reject(err);
        }
        resolve(response);
      });
    })

    return testPromise.then(function(result) {
      var events = result.items;
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
      
      expect(result).to.not.equal(null);
    });
  }),
  
  it('insertEvent', function() {
    var helper = new CalendarHelper();
    var params = {
      calendar: ["goldenfreedomcoders", "innojam2016"],
      timeMin: "2016-04-30",
      timeMax: '2016-04-21'
    };

    var testPromise = new Promise(function(resolve, reject) {
      helper.addEvent(params, function(err, response) {
        if (err) {
          console.log("Error: " + err);
          reject(err);
        }
        resolve(response);
      });
    })

    return testPromise.then(function(result) {
      
      expect(result).to.not.equal(null);
    });
  })
});


