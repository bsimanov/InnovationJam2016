var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var GoogleAuth = require('./../lib/googleAuth');

describe('GoogleAuth', function() {
  it('goldenfreedomcoders calendar file exists', function() {
    var auth = GoogleAuth.getAuth("goldenfreedomcoders");
    expect(auth.credentials).to.not.equal(null);
  });
});
