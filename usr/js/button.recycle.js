var buttonRecycle = function(type,title,target) {  
  buttonRecycle.parent.init.call(this,type,title,target);
};
buttonRecycle.prototype             = new oButton();
buttonRecycle.prototype.constructor = oButton;
buttonRecycle.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonRecycle.prototype.click = function() {
  l.data.data[l.data.selected].recycle();
};