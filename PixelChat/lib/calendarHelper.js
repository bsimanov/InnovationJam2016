var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// Input: range, two emails

// const Calendar = function(token, actions, logger) {

function CalendarHelper() {}

CalendarHelper.prototype.hasFreeTime = function() {
  return 0;
};

module.exports = CalendarHelper;