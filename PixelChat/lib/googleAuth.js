var fs = require('fs');
var googleAuth = require('google-auth-library');

exports.getAuth =  function(emailId)
{
  var credentials = {};
  var content = fs.readFileSync(emailId + '_secret.json');
  credentials = JSON.parse(content);

  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  var token = fs.readFileSync(emailId + '-token.json');
  oauth2Client.credentials = JSON.parse(token);
  return oauth2Client;
}

// module.exports = getAuth;
