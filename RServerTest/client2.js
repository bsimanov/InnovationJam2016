var rio = require("rio");
var path = require("path");

//rio.enableDebug(true);

rio.e({command: "pi / 2 * 2"});	// DEMO function to validate calls work

var args = "defg";

function displayResponse(err, res) {
    if (!err) {
        console.log("output=" + res);
    } else {
        console.log("call failed");
    }
}
/*
rio.e({
    filename: path.join(__dirname, "priority_inbox.R"),
    //filename: path.join(__dirname, "meow2.r"),
    entrypoint: "evaluateMsg",
    data: args,
    callback: displayResponse
});
*/
rio.e({command: "evaluateMsg('xyz')"});
