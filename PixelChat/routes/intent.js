var express = require('express');
var router = express.Router();
const WIT_TOKEN = 'I3YIED2VEPKOWTI42FXITQOMLEOWJ544';
var CalendarHelper = require('./../lib/calendarHelper');
var WitApi =  require('./../lib/witapi');
var client = new WitApi(WIT_TOKEN);

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0]
  ;
  if (!val) {
    return null;
  }
  return val;
  //return typeof val === 'object' ? val.value : val;
};

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

router.get('/',function(req, res, next) {
    client.getIntent(req.query.msg)
      .then(function(intent) {
        
        if (intent.outcomes[0].entities.intent) {
          
          var result = { "IntentStatus": "Ok"};        
          result.Intent = intent.outcomes[0].entities.intent[0].value;
          switch(result.Intent) {
            case "meeting_invite":
              var saytext =  "Inviting Meeting ";
              // time of day
              if (intent.outcomes[0].entities.meeting_range)
              {
                
                var fromdate = new Date(intent.outcomes[0].entities.meeting_range[0].from.value);
                var todate = new Date(intent.outcomes[0].entities.meeting_range[0].to.value);
                
                saytext = saytext + fromdate.toLocaleString() + 
                      " to " + todate.toLocaleString();
              }
             
            
              result.say = saytext;
              res.status(200).json(result);
              break;
            case "query_calendar":
            
            
              var freetime = firstEntityValue(intent.outcomes[0].entities, "freetime");
              
              var dateparam =  firstEntityValue(intent.outcomes[0].entities,"datetime");
             
              var meeting_range =  firstEntityValue(intent.outcomes[0].entities,"meeting_range");
              var timeMin;
              var timeMax; 
              
              if (meeting_range){
                
              }
              else {
                if (dateparam.type) { 
                  if (dateparam.type == "interval") {
                    
                     timeMin = dateparam.from.value;
                      timeMax = dateparam.to.value;
                  }
                  
                }
                else {
                  switch (dateparam.grain) {
                    case "hour":
                      timeMin = dateparam.value;
                      timeMax = new Date(dateparam.value).addHours(1);

                      break;
                    case "day":
                      break;

         

                  }
                }
              }
              
              console.log("query_calendar");
              var params = {
                calendarId: "goldenfreedomcoders",
                timeMin: timeMin,
                timeMax: timeMax
              };
              
              var helper = new CalendarHelper();
              var promise = helper.getFreeTime(params);

              promise.then(function (calResponse) {
                var events = calResponse.items;
                if (events.length == 0) {
                  result.say = "Looks like your schedule is clear.";
                  res.status(200).json(result);
                } else {
                  var start = events[0].start.dateTime || events[0].start.date;
                  result.say = "You have " + events.length + " meetings. First one " + events[0].summary + " starts " + start;
                  res.status(200).json(result);
                }
              },
              function(reason) {
                console.log(reason); // "Testing static reject"
              
                throw new Error(reason);
              });
              break;
            default:
            
          }
          //res.status(200).json(result);
        }
        else
        {
          result = {"IntentStatus": "Fail"};
          res.status(200).json(result);
          
        }
      })
      .catch(function(err){
        res.status(500);
      })
});

module.exports = router;
