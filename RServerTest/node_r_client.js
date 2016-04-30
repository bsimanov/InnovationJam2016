var rio = require("rio");

rio.e({command: "pi / 2 * 2"});
rio.e({command: "c(1, 2)"});
rio.e({command: "as.character('Hello World')"});
rio.e({command: "c('a', 'b')"});
rio.e({command: "Sys.sleep(5); 11"})

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
