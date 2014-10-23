var api_key = "af33513bef273cdbafef51ba4d2eaa12";
var secret = "435337766893fbf5";
var perms = 'read';
var flickr_api_url = "https://api.flickr.com/services/rest/?method="

function getToken() {
  var oauth = OAuth({
      consumer: {
        public: api_key,
        secret: secret
      },
      signature_method: 'HMAC-SHA1'
  });


  /*
  https://www.flickr.com/services/oauth/request_token?
    oauth_consumer_key=af33513bef273cdbafef51ba4d2eaa12&
    oauth_nonce=Q4sUcdr0z1Oyyr6XGx04Eef1K7lx3bT0&
    oauth_signature_method=HMAC-SHA1&
    oauth_timestamp=1414053943&
    oauth_version=1.0&
    oauth_callback=&
    oauth_signature=sMSR%2FaWRleiuvw%2BG6b0%2BPnpmu9E%3D
  */
  var request_data = {
    url: 'https://www.flickr.com/services/oauth/request_token',
    method: 'GET',
    data: {
       oauth_callback: 'http://www.hinet.net'
    }
  };
  
  var obj = oauth.authorize(request_data);
   
  console.log(obj);
  /*
  $.ajax({
    url: request_data.url,
    type: request_data.method,
    crossDomain: true,
    data: oauth.authorize(request_data)
  }).done(function(data) {
    //process your data here
    console.og(data);
  });
  */
  $.ajax({
    url: 'https://www.flickr.com/services/oauth/request_token',
    method: 'POST',
    data: {
      oauth_consumer_key: 'af33513bef273cdbafef51ba4d2eaa12',
      oauth_nonce: 'Q4sUcdr0z1Oyyr6XGx04Eef1K7lx3bT0',
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: 1414053943,
      oauth_version: '1.0',
      oauth_callback: '', 
      oauth_signature: 'sMSR%2FaWRleiuvw%2BG6b0%2BPnpmu9E%3D'
      
    }
  }).done( function (data) {
    console.log(data);
  });
}

function getToken( frob ){
  var method = 'flickr.auth.getToken';
  var api_sig = CryptoJS.MD5(secret+'api_key'+api_key+'frob'+frob+'method'+ method);
  console.log("api_sig: " + api_sig);
  
  $.ajax({
    url: 'https://api.flickr.com/services/rest/',        
    method: 'GET',
    data: {
      method: method,
      api_key: api_key,
      frob: frob,
      format: 'json',
      nojsoncallback: 1,
      api_sig: api_sig
    }
   }).done ( function (data) {
    console.log("return data");
    console.log(data)
   }); 
}

function getLoginURL(){
  /* https://www.flickr.com/services/api/auth.howto.web.html */
  var api_sig = CryptoJS.MD5(secret+'api_key'+api_key+'perms'+perms);
  
  return 'http://flickr.com/services/auth/?api_key='+api_key+'&perms='+perms+'&api_sig='+api_sig;
}

function testLogin() {

}