var express = require('express');
var router = express.Router();

/* GET mail listing. */
router.get('/', function(req, res, next) {
    var func = req.query.function; //http://pixelchat.cfapps.io/mail?function=getMail
    if (func) {
        switch (func.toLowerCase()) {
            case "getmail":
                var returnEmail = {
                    id: "q23142143",
                    body: "From: Steve Burt <Steve_Burt@cursor-system.com>\n \
    Date: Thu, 22 Aug 2002 12:46:18 +0100\n \
    Subject: [zzzzteana] RE: Alexander\n \
    <msg body>"
                }
                
                res.status(200).json(JSON.stringify(returnEmail));
                break;
            case "prioritize":
                var id = req.query.id;
                var priority = req.query.priority;
                
                res.status(200).json({"status":"done"});
                break;
            default:
                res.send('Unknown function');
        }
    } else {
            res.send('Function required');
    }
});

module.exports = router;
