/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var request = require('request');

/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to Pixel your personal digital assistant";
    var repromptText = "You can ask me to read your email";
    response.ask(speechOutput, repromptText);
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.intentHandlers = {
    // register custom intent handlers
    "HelloWorldIntent": function (intent, session, response) {
      var question;
      var date;
      console.log("Slots: " + JSON.stringify(intent.slots));
      if (intent.slots && intent.slots.Question) {
        question = intent.slots.Question.value;
      }
      console.log("Question: "  + question);
      if (intent.slots && intent.slots.Date) {
        date = intent.slots.Date.value;
      }
      console.log("Date: " + date);

      var msg = "Lets%20meet%20today";
      if (question && date) {
        if (question === "when") {
          msg = "When%20is%20my%20meeting%20" + date;
        }
        if (question === "what") {
          msg = "What%20meetings%20do%20I%20have%20" + date;
        }
        if (question === "do I") {
          msg = "Do%20I%20have%20a%20meeting%20" + date;
        }
      }
      console.log("Msg: " + msg);
      console.log(intent);
      console.log(JSON.stringify(intent));
      var options = {
        method: 'GET',
        url: 'http://pixelchat.cfapps.io/intent?msg=' + msg
      }
      request(options, function(error, res, body) {
         if (error)
         {
             console.log(error);
             response.tellWithCard("BROKEN: Email from Joe, Boris!!", "Pixel", "Email from Lauren!");
         } else {
           console.log("Response from Pixel: " + body);
           var fromWit = JSON.parse(body);
           //console.log(JSON.stringify(body));
           response.tellWithCard(fromWit.say, "Pixel", "Email from Lauren!");
            //  console.log("Response: " + JSON.stringify(response) + "--\n" + body);
            //  if (response.statusCode === 200) {
            //    // Do nothing
            //  }
            //  else
            //  {
            //    console.log("Invalid response: " + response.status);
            //  }
         }
      });
      // response.tellWithCard("Email from Joe, Boris!!", "Pixel", "Email from Lauren!");
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask me to read your important email!", "You can say read my important email!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};
