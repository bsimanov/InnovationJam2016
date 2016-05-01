'use strict';
var redis = require('redis');
var request = require('request');

var options = null;
if (process.env.VCAP_SERVICES) {
    var services = JSON.parse(process.env.VCAP_SERVICES);
    var redisConfig = services["rediscloud"];
    if (redisConfig) {
      var node = redisConfig[0];
      options = {
          host: node.credentials.hostname,
          port: node.credentials.port,
          pass: node.credentials.password,
      };
    }
}

var pub;
var sub;

if (options) {
console.log(options);

    sub = redis.createClient(options);
    sub.auth(options.pass);
    pub = redis.createClient(options);
    pub.auth(options.pass);
} else {
    sub = redis.createClient();
    pub = redis.createClient();
}
sub.subscribe('chat');

module.exports = function(io) {
    io.on('connection', function(socket) {
        /*
         When the user sends a chat message, publish it to everyone (including myself) using
         Redis' 'pub' client we created earlier.
         Notice that we are getting user's name from session.
         */
        socket.on('chat', function(data) {
            var msg = JSON.parse(data);
             
            if (msg.msg.indexOf('@pixel')> -1)
            {
                var msgToSend = msg.msg.replace("@pixel", "");
                console.log('http://pixelchat.cfapps.io/intent?msg=' + encodeURIComponent(msgToSend));
                try {
                    request.get('http://pixelchat.cfapps.io/intent?msg=' + encodeURIComponent(msgToSend),
                        function (err, response, body) {

                            console.log("---" + body);
                            if (err) {
                                console.log(err);
                           
                                var pixelmessage = {
                                    action: "message",
                                    user: "pixel",
                                    msg: 'Pixel does not understand the msg'
                                };
                                pub.publish('chat', JSON.stringify(pixelmessage));

                            } else {
                                var pixelmessage = {
                                    action: "message",
                                    user: 'pixel',
                                    msg: JSON.parse(body).say
                                };
                                pub.publish('chat', JSON.stringify(pixelmessage));
                            }
                        });
                } catch (error) {
                    console.log(error);
                }
            }
            
            var reply = JSON.stringify({
                action: 'message',
                user: socket.handshake.session.user,
                msg: msg.msg
            });
            console.dir(reply);
            pub.publish('chat', reply);
        });

        /*
         When a user joins the channel, publish it to everyone (including myself) using
         Redis' 'pub' client we created earlier.
         Notice that we are getting user's name from session.
         */
        socket.on('join', function() {
            var reply = JSON.stringify({
                action: 'control',
                user: socket.handshake.session.user,
                msg: ' joined the channel'
            });
             console.dir(reply);
            pub.publish('chat', reply);
        });

        /*
         Use Redis' 'sub' (subscriber) client to listen to any message from Redis to server.
         When a message arrives, send it back to browser using socket.io
         */
        sub.on('message', function(channel, message) {
            
            
            

            socket.emit(channel, message);
        });
    })
}
