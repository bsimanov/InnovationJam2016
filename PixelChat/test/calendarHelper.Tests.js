var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var CalendarHelper = require('./../lib/calendarHelper');

describe('CalendarHelper', function() {
  it('First test', function() {
    var helper = new CalendarHelper();
    expect(helper.hasFreeTime()).to.equal(0);
  });
});
