
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var req = require('request');
var people = {};
var poundMessage = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/main.css', function(req, res){
  res.sendFile(__dirname + '/main.css');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(msg.indexOf("#chat") );
    var sessionid = socket.id;
    var res = {
      person: "",
      msg: ""
    };

    if (msg.indexOf("#join") > -1 )
    {
      newchatperson = msg.substring(6);
      people[sessionid] = newchatperson;
      console.log(people);
      console.log(people.length);
      msg = "Hi " + newchatperson;
    }

    if (people[sessionid] !== null)
    {
      res.person = people[sessionid];
    }

    if (msg.indexOf("@pixel") > -1 )
    {
      var msgToSend = msg.replace("@pixel", "");
      console.log(msgToSend);
      try {
      req.get('http://pixelchat.cfapps.io/intent?msg=' + encodeURIComponent(msgToSend),
        function(err, response, body){
          res.person = '@pixel';
          console.log("---" + body);
          if (err)
          {
            console.log(err);
            res.say = 'Pixel does not understand the msg';
            io.emit('chat message', JSON.stringify(res));
          } else {
            res.msg = JSON.parse(body).say;
            io.emit('chat message', JSON.stringify(res));
          }
        });
      } catch (err)
      {
        console.log(err);
      }
    }
    res.msg = msg;
    io.emit('chat message', JSON.stringify(res));
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
