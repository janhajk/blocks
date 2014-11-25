var buttonUp = function(type,title,target,position) {  
  buttonUp.parent.init.call(this,type,title,target,position);
};
buttonUp.prototype             = new oButton();
buttonUp.prototype.constructor = oButton;
buttonUp.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonUp.prototype.click = function() {
  var d     = l.data;
  var pid   = d.data[d.selected].parents[0];
  d.selected = pid;
  d.hasher.setActive(pid);
  l.display();
};

buttonUp.prototype.getHtml = function() {
 return '<li id="'+this.name+'" class="buttonUp">'+
          '<div id="sfield-up" class="sfield">'+
            '<div id="scontent-up" class="scontent">..</div>'+
            '<div class="newline"></div>'+
          '</div>'+
        '</li>';
};