var prj_prefix = "flogger_";
var api_key = "af33513bef273cdbafef51ba4d2eaa12";
var secret = "435337766893fbf5";
var perms = 'read';
var flickr_api_url = "https://api.flickr.com/services/rest/?method="
var user;

var curr_page = 1;
var max_page = 1;

var photo_set_items = new Array();

var default_template_str = "..<br>\n<div style='text-align: center;'><a href='{web_url}' target='_blank'><img src='{image_medium_800}' border='0'></a></div><br>\n..<br>\n..<br>\n";

function getToken() {
  var oauth = OAuth({
      consumer: {
        public: api_key,
        secret: secret
      },
      signature_method: 'HMAC-SHA1'
  });


  var request_data = {
    url: 'https://www.flickr.com/services/oauth/request_token',
    method: 'GET',
    data: {
       oauth_callback: 'http://www.hinet.net'
    }
  };
  
  var obj = oauth.authorize(request_data);
   
  //console.log(obj);
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
  });
}

function getToken( frob ){
  var method = 'flickr.auth.getToken';
  //console.log("2frob : " + frob );
  //console.log(secret+'api_key'+api_key+'frob'+frob+'method'+ method);

  var r = $.Deferred();
  
  var api_sig = CryptoJS.MD5(secret+
    'api_key'+api_key+
    'formatjson'+
    'frob'+frob+
    'method'+method + 
    'nojsoncallback1').toString();
  //console.log("api_sig: " + api_sig);
  var request_data = {
      method: method,
      api_key: api_key,
      frob: frob,
      format: 'json',
      nojsoncallback: 1,
      api_sig: api_sig
  };
  
  $.ajax({
    url: 'https://api.flickr.com/services/rest/?api_key='+api_key+'&method='+method+'&frob='+frob+'&format=json&nojsoncallback=1&api_sig='+api_sig,        
    method: 'GET',
    data: request_data
   }).done ( function (data) {
    //console.log("return data");
    //console.log(data);
    if (data.stat == "ok") {
      // get album list
      user = data.auth.user;
      //console.log("user");
      //console.log( user );
      localStorage.setItem(prj_prefix+"username" ,user.username);
      localStorage.setItem(prj_prefix+"fullname" ,user.fullname);
      localStorage.setItem(prj_prefix+"nsid" ,user.nsid);

      //console.log( localStorage.getItem(prj_prefix+"nsid") );
      
    } else {
      console.log("Authorized Fail!");
    }
    r.resolve();
   }); 
   
   return r;
}

function getLoginURL(){
  /* https://www.flickr.com/services/api/auth.howto.web.html */
  var api_sig = CryptoJS.MD5(secret+'api_key'+api_key+'perms'+perms).toString();
  
  return 'http://flickr.com/services/auth/?api_key='+api_key+'&perms='+perms+'&api_sig='+api_sig;
}

function getAlbumList( nsid ) {
  $("#btn-get-photo").button("loading");

  var url = "https://api.flickr.com/services/rest/?" +
            "method=flickr.photosets.getList&" +
            "api_key=" + api_key +
            "&user_id=" + escape( nsid ) +
            "&format=json&jsoncallback=?";
  $.getJSON(url, procAlbumListData);
}

function procAlbumListData( data ) {
  if (data.stat == "ok")
  {
    photo_set = new Array();
    $.each(data.photosets.photoset, function(i,item){    
      photo_set[item.id] = item;    

      $("#sel-album-list").append("<option value='" + item.id + "'>" +
        item.title._content+ "(" + item.photos + ")</option>");
    });

    $("#btn-get-photo").button('reset');
  }
}

function getPhotosInAlbum( page ) {
  // reset data and html 
  $("#div-photo-container").html("");
  $("#pagination-top").html("");
  $("#div-pagination").toggle( false );
  $("#span-picked-photo").html(" 0 " );
  $("#text-html-result").val("");

  // hide the html result div
  $("#div-html-result").toggle( false );

  var per_page = $("#sel-photo-per-page").val();
  //var page = curr_page;
  
  var url = "https://api.flickr.com/services/rest/?" + 
            "method=flickr.photosets.getPhotos&extras=url_o,url_c&" + 
            "api_key=" + api_key +
            "&photoset_id=" +   $("#sel-album-list").val() + 
            "&per_page=" + per_page + "&page=" + page +  
            "&format=json&jsoncallback=?";

  $.getJSON(url, procPhotosInAlbum); 
}

function procPhotosInAlbum( data ) {
  var html_str = "";
  if (data.stat == "ok" ) {
    photo_set_items = new Array();
    $.each(data.photoset.photo, function(i,item) {
      var img = new Image(item, localStorage.getItem(prj_prefix + "nsid"));
      photo_set_items[item.id] = img;

      //render thumb HTML 
      if  ( ($("#div-photo-container div.row").length  == 0)  || 
            ($("#div-photo-container div.row:last-child div").length == 6) )
      {
        $("#div-photo-container").append("<div class='row' id='" + i + "'></div>");
      }
      $("#div-photo-container div.row:last-child").append('<div class="col-md-2 thumbnail" id="div-thumb-'+item.id+'"><img class="" src="' + img.getImageSquare75() +
        '" id="img-thumb-' +  item.id + '">' +
        '<span class="glyphicon glyphicon-ok thumbnail-checkbox"></span>' +
        '</div>');
      $("#div-thumb-" + item.id).bind("click",  function (e) {
        $(this).children("span" ).toggle();
        $("#span-picked-photo").html(" " +  $("#div-photo-container div.row div span:visible").length + " " );
      });

    });

    // render pagination
    max_page = data.photoset.pages;
    $("#pagination-top").append("<li id='li-prev-page' onClick='prevPage();'><a href='#'>&laquo;</a></li>");
    for (var i=0;i<data.photoset.pages;i++) {
       $("#pagination-top").append("<li onclick='goPage(" + (i+1) + ");'><a href='#'>" + (i+1) + "</a></li>");
    }
    $("#pagination-top").append("<li id='li-nex-page' onClick='nextPage();'><a href='#'>&raquo;</a></li>");
    $("#pagination-top li:nth-child(" + (curr_page+1) + ")").toggleClass("active");


    // show the pagination div 
    $("#div-pagination").toggle();
    // show the html result div
    $("#div-html-result").toggle( true );
  }
}

function prevPage(){
  if (curr_page > 1) {
    goPage(curr_page-1);
  }
}

function nextPage(){
  if ( curr_page < max_page) {
    goPage( curr_page+1 );
  }
}

function goPage(idx) {
  if (idx == curr_page ) {
    //do nothig
    return;
  }
  curr_page = idx;
  getPhotosInAlbum( curr_page );
}

function getHTML() {
  var html_template = $("#text-html-template").val()

  var result_str = "";

  $("#div-photo-container div.row div").each( function (idx) {
    //console.log ( $(this).children("span").css("display") );
    //console.log ( $(this).children("span").is(":hidden") );
    if ( !$(this).children("span").is(":hidden") ) {
      //console.log( $(this).attr("id").replace("div-thumb-", "") );
      var tmp_str = html_template;
      var img_id = $(this).attr("id").replace("div-thumb-", "");

      var img = photo_set_items[img_id];
      
      tmp_str = tmp_str.replace("{web_url}", img.getWebUrl())
                       .replace("{image_medium_800}", img.getImageMedium800())
                       .replace("{image_square_75}", img.getImageSquare75())
                       .replace("{image_square_150}", img.getImageSquare150())
                       .replace("{image_thumbnail_100}", img.getImageThumbnail100())
                       .replace("{image_medium_500}", img.getImageMedium500())
                       .replace("{image_medium_640}", img.getImageMedium640())
                       .replace("{image_large_1024}", img.getImageLarge1024())
                       .replace("{image_original}", img.getImageOriginal());

      result_str += tmp_str;
    }
  });

  //$("#text-html-result").html( result_str );
  $("#text-html-result").val( result_str );
}

function copytoClipboard() {
   alert("Sorry, wait for browser support!!");
}

function testLogin() {

}
