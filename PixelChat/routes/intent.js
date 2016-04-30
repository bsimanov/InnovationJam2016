var express = require('express');
var router = express.Router();
const WIT_TOKEN = 'I3YIED2VEPKOWTI42FXITQOMLEOWJ544';

var WitApi =  require('./../lib/witapi');
var client = new WitApi(WIT_TOKEN);
router.get('/',function(req, res, next) {
    client.getIntent(req.query.msg)
      .then(function(intent) {
        
        if (intent.outcomes[0].entities.intent) {
          
          var result = { "IntentStatus": "Ok"};        
          result.Intent = intent.outcomes[0].entities.intent[0].value;
          switch(result.Intent) {
            case "meeting_invite":
              result.say = "Inviting Meeting";
              break;
            case "query_calendar":
              result.say = "Your next appoint is at"  
              break;
            default:
            
          }
          res.status(200).json(result);
        }
        else
        {
          result = {"IntentStatus": "Fail"};
          res.status(200).json(result);
          
        }
        
        
        
        

      })
      .catch(function(err){
        res.status(500)
      })
});

module.exports = router;
