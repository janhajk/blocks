var buttonUpdate = function(type,title,target) {  
  buttonUpdate.parent.init.call(this,type,title,target);
};
buttonUpdate.prototype             = new oButton();
buttonUpdate.prototype.constructor = oButton;
buttonUpdate.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonUpdate.prototype.click = function() {
  l.data.get();
};