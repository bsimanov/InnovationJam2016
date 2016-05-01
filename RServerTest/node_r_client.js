var rio = require("rio");
var path = require("path");

//rio.enableDebug(true);


rio.e({command: "pi / 2 * 2"});
rio.e({command: "c(1, 2)"});
rio.e({command: "as.character('Hello World')"});
rio.e({command: "c('a', 'b')"});
//rio.e({command: "Sys.sleep(5); 11"})

rio.$e({
    command: "pi / 2 * 2"
}).then(function (res) {
    console.log(res);
});

rio.e({
    command: "2 + 2"
}).e({
    command: "3 + 3"
});


//rio.e({command: "eval(exampleFunction('xyz'))"});
//rio.e({command: "evaluate.msg('xyz')"});


var args = "defg";

function displayResponse(err, res) {
    if (!err) {
        console.log("output=" + res);
    } else {
        console.log("call failed");
    }
}

rio.e({
    filename: path.join(__dirname, "priority_inbox.R"),
    //filename: path.join(__dirname, "meow2.r"),
    entrypoint: "evaluateMsg",
    data: args,
    callback: displayResponse
});


//rio.e({command: "evaluate.msg('xyz')"});