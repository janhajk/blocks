/**
 * Der Button Constructor
 */
var button = function(type, title, target, position) {
  return eval('new button'+(type[0].toUpperCase() + type.substring(1, type.length))+'(type,title,target,position)');
};



/**
 * Das eigentliche Button Objekt
 */
var oButton = function() {
 
};

oButton.prototype.init = function(type, title, target, arg) {
  this.type  = type;
  this.title = title;
  this.name  = 'button' + uniqueId();
  
  this.shortkeys = [];
  if (arg !== undefined && arg.length===1) {
    this.shortkeys = [arg.charCodeAt(0), arg.toUpperCase().charCodeAt(0)];
    this.title = this.title + ' [' + arg + ']';
  } 
  
  if (arg === 'prepend') {
    $('#'+target).prepend(this.getHtml());
  }
  else {
    $('#'+target).append(this.getHtml());
  }
  this.setClickEvent();
  this.keypress();
 
};


oButton.prototype.setClickEvent = function() {
   var me = this;
   $('#' + this.name).live('click', function(){
     me.click();
   });
};

oButton.prototype.click = function() {
  alert('Missing click-event for button with the type of "' + this.type + '"; Please create one');
};

oButton.prototype.getHtml = function() {
  if (supportsSVG() && this.svgExist()) {
    return '<div id="'+this.name+'" style="'+this.getStyle()+';" title="'+this.title+'">'+this.createSvg(window.janframe.icons.svg[this.type])+'</div>';
  }
  return '<div id="'+this.name+'" style="'+this.getStyle()+';'+this.getIconBackgroundImage()+'" title="'+this.title+'"></div>';
};

oButton.prototype.getIconBackgroundImage = function() {
  var icon = this.iconImage(this.type);
  return 'background-image:url(data:image/'+icon.type+';'+icon.encoding+','+icon.data+')';
};

oButton.prototype.svgExist = function() {
  return (window.janframe.icons.svg[this.type] !== undefined);
};

oButton.prototype.createSvg = function(content) {
  return '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">'+this.svgBackground()+content+'</svg>';
};

oButton.prototype.svgBackground = function() {
  return '<rect style="fill:#000" id="b'+this.name+'" x="0" y="0" width="20" height="20" ry="3.5" rx="3.5" />';
};


oButton.prototype.getStyle = function() {
  return [
    'position:relative',
    'cursor:pointer',
    'width:20px',
    'height:20px',
    'margin:0',
    'padding:0',
    'margin-left:5px',
    'top:5px',
    'float:left',
    'background-repeat:none',
    'color:white'
  ].join(';');
};




/**
 * URI-Image heraussuchen
 * TODO: Was wenn nicht gefunden?
 */
oButton.prototype.iconImage = function(icon) {
  return {
    data     : window.janframe.icons.png[icon],
    type     : 'png',
    encoding : 'base64'
  };
};


/**
 * Shortkeys
 */
oButton.prototype.keypress = function() {
  var owner = this, blacklist = ['code'];
  // keypress für alle Printable-Keys
  $(document).keypress(function(e){
    var i;
    if (e.target.className.search(/noShortcuts/) === -1 && blacklist.indexOf(e.target.id) === -1) {
      for (i in owner.shortkeys) {
        if (e.which === owner.shortkeys[i]) {
          e.preventDefault();
          owner.click();
        } 
      }
    }
  });
};