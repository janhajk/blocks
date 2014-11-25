var buttonCompleted = function(type,title,target) {  
  title = title + ' [space]';
  buttonCompleted.parent.init.call(this,type,title,target);
  this.shortkeys = [32];
};
buttonCompleted.prototype             = new oButton();
buttonCompleted.prototype.constructor = oButton;
buttonCompleted.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonCompleted.prototype.click = function() {
  l.data.data[l.data.selected].toggleActive();
};