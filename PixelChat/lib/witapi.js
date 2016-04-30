var req = require('request');
var q = require('q');
function WitApi(token) {  
    this.token = token;
    
}

WitApi.prototype.getIntent = function(message) {
    var deferred = q.defer();
    
    var options = {
            method: 'GET',
            url: 'https://api.wit.ai/message?q='+encodeURIComponent(message),
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
      }
      req(options,function(error, response, body) {
      
         if (error)
         {
             console.log(error);
             deferred.reject(new Error(error));
             
         } else {
             console.log(JSON.stringify(response) + "--\n" + body);
             if (response.statusCode === 200) {
                 deferred.resolve(JSON.parse(body));
             }
             else  
             {
                deferred.reject(new Error("Invalide response") + response.status)    
             }
             
         }

      })
      return deferred.promise;
};

module.exports = WitApi;