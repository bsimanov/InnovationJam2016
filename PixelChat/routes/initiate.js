var express = require('express');

var https = require('https');






var router = express.Router();

const Wit = require('wit-node');
const WIT_TOKEN = 'I3YIED2VEPKOWTI42FXITQOMLEOWJ544';

var actions = {
  say(sessionId, context, message, cb) {
    console.log(message);
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    cb(context);
    
  },
  error(sessionId, context, error) {
    console.log(error.message);
  }
};

router.get('/', function(req, res, next) {
console.log("Hello");
  var options = {
        host: 'google.com',
        path: '/'

      };
  https.request(options, function(response) {
    console.log(response);
    
  });

});

router.post('/intent',function(req, res, next) {
    
});

module.exports = router;
