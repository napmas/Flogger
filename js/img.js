function Image(flickr_image, nsid){
   
  this.meta = flickr_image;
  
  var tmp_str = "http://farm" +
                  this.meta.farm + ".static.flickr.com/" + 
                  this.meta.server + "/" + 
                  this.meta.id + "_" + 
                  this.meta.secret;
  this.image_square_75 =    tmp_str + "_s.jpg";                  
  this.image_square_150 =    tmp_str + "_q.jpg";
  this.image_thumbnail_100 =     tmp_str + "_t.jpg";  
  this.image_small_240 = tmp_str + "_m.jpg"; 
  this.image_small_320 = tmp_str + "_n.jpg";
  this.image_medium_500 =    tmp_str + ".jpg"; 
  this.image_medium_640 =    tmp_str + "_z.jpg";
  this.image_medium_800 =    this.meta.url_c;
  this.image_large_1024 =    tmp_str + "_b.jpg";
  this.image_z = tmp_str + "_z.jpg";
  
  this.image_original =    this.meta.url_o;
  
  this.web_url = "http://www.flickr.com/photos/" + nsid + "/" + this.meta.id + "/";
  
  this.title = this.meta.title;
 
}
 
Image.prototype.getImageSquare75 = function () {
  return this.image_square_75;
}

Image.prototype.getImageSquare150 = function () {
  return this.image_square_150;
}
 
Image.prototype.getImageThumbnail100 = function () {
  return this.image_thumbnail_100;
}
 
Image.prototype.getImageOriginal = function () {
  return this.image_original;
}
 
Image.prototype.getImageMedium800 = function () {
  return this.image_medium_800;
}
 
Image.prototype.getImageMedium500 = function () {
  return this.image_medium_500;
}
 
Image.prototype.getImageMedium640 = function () {
  return this.image_medium_640;
}
/*
Image.prototype.getImageZ = function () {
  return this.image_z;
}
*/
Image.prototype.getImageLarge1024 = function () {
  return this.image_large_1024;
}
 
Image.prototype.getWebUrl = function () {
  return this.web_url;
}

Image.prototype.getTitle = function () {
  return this.title
}
