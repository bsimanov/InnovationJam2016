var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var CalendarHelper = require('./../lib/calendarHelper');

describe('CalendarHelper', function() {
  it('First test', function() {
    var helper = new CalendarHelper();
    expect(helper.hasFreeTime()).to.equal(0);
  },
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
      expect(result).to.equal(true);
    });
    // expect(helper.getFreeTime('goldenfreedomcoders', 'innojam2016', '2016-04-30', '2016-04-31')).to.equal(true);
  }));

});
