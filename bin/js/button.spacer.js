var buttonSpacer = function(type,title,target) {  
  buttonSpacer.parent.init.call(this,type,title,target);
};
buttonSpacer.prototype             = new oButton();
buttonSpacer.prototype.constructor = oButton;
buttonSpacer.parent                = oButton.prototype; 


/**
 * Click Event
 * Spacer hat kein Click Event
 */
buttonSpacer.prototype.click = function() {
  return null;
};

/**
 * Style Überschriebung
 */
buttonSpacer.prototype.getHtml = function() {
  return '<div id="'+this.name+'" style="'+this.getStyle()+'" title="'+this.title+'"></div>';
};

/**
 * Überschreiben der getIcon Methode, da spacer kein Icon hat;
 */
buttonSpacer.prototype.getIcon = function() {
  return '';
};