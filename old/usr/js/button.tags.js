var buttonTags = function(type,title,target) {  
  buttonTags.parent.init.call(this,type,title,target);
};
buttonTags.prototype             = new oButton();
buttonTags.prototype.constructor = oButton;
buttonTags.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonTags.prototype.click = function() {
alert('in Bearbeitung');
};