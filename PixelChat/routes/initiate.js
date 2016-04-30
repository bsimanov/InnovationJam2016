var express = require('express');
var router = express.Router();

const Wit = require('node-wit').Wit;
const WIT_TOKEN = 'I3YIED2VEPKOWTI42FXITQOMLEOWJ544';

const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);
    
  },
  merge(sessionId, context, entities, message, cb) {
    
    
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
};

router.get('/', function(req, res, next) {
  const witcontext = {};
  
  
  var client = new Wit(WIT_TOKEN,actions);
  console.log("Gothere");
  const context = {};
  client.message('what is the weather in London?', 
      witcontext, 
      function(error, data) {
        if (error) {
          console.log('Oops! Got an error: ' + error);
          res.send("Error");
        } else {
          res.send(JSON.stringify(data));
          console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
        }
      });

});

router.post('/intent',function(req, res, next) {
    
});

module.exports = router;
