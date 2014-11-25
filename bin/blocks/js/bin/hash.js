/*
 * Hasher
 * 
 * Format: #/activeId
 */

var hasher = function() {
  this.cId = 0;
  

  

};

hasher.prototype.setActive = function(id) {
    this.cId = id;
    this.set();
};

hasher.prototype.getActive = function() {
  return this.get().split('/')[1];

};

hasher.prototype.active = function() {
  var hash = this.get();
  return (hash.indexOf('/') === -1) ? false : true;
};

hasher.prototype.get = function() {
  return document.location.hash;
};

hasher.prototype.set = function() {
  document.location.hash = '/' + this.cId;
};