var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var WitApi = require('./../lib/witapi');

var Api = new WitApi('I3YIED2VEPKOWTI42FXITQOMLEOWJ544');
describe('test https call', function() {
  it('First test', function(done) {
      
      this.timeout(10000);
      Api.getIntent("Let's get together today")
        .then(function(body){
          
          done();
      })
     
     
        
  });
});