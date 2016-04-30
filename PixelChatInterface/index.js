
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var req = require('request');
var people = [];
var poundMessage = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(msg.indexOf("#chat") );
    var sessionid = socket.id;

    if (msg.indexOf("#chat") > -1 )
    {
      newchatperson = msg.substring(6);
      people.push(newchatperson + sessionid);
      console.log(people);
      console.log(people.length);
      msg = "Hi " + newchatperson;
    }
    if (msg.indexOf("@pixel") > -1 )
    {
      var msgToSend = msg.replace("@pixel", "");
      console.log(msgToSend);
      try {
      req.get('http://pixelchat.cfapps.io/intent?msg=' + encodeURIComponent(msgToSend),
        function(err, response, body){
          console.log("---" + body);
          if (err)
          {
            console.log(err);
            io.emit('chat message','Pixel do not understand the msg');
          } else {

            io.emit('chat message',JSON.parse(body).say);
          }
        });
      } catch (err)
      {
        console.log(err);
      }
    }
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
