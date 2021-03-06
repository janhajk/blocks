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
    $('#'+target).prepend(this.getDOM());
  }
  else {
    $('#'+target).append(this.getDOM());
  }
  this.setClickEvent();
  this.keypress();

};


oButton.prototype.setClickEvent = function() {
   var self = this;
   $('#' + this.name).live('click', function(){
     self.click();
   });
};

oButton.prototype.click = function() {
  alert('Missing click-event for button with the type of "' + this.type + '"; Please create one');
};

oButton.prototype.getDOM = function() {
    var div = document.createElement('div');
    div.name = this.name;
    div.className = 'menubutton';
    div.title = this.title;
    if(supportsSVG() && this.svgExist()) {
        //div.appendChild(this.createSvg());
        div.innerHTML = this.createSvg();
    } else {
        div.style.backgroundImage = this.getIconBackgroundImage();
    }
    return div;
};


oButton.prototype.getIconBackgroundImage = function() {
  var icon = this.iconImage(this.type);
  return 'url(data:image/'+icon.type+';'+icon.encoding+','+icon.data+')';
};

oButton.prototype.svgExist = function() {
  return (window.janframe.icons.svg[this.type] !== undefined);
};



oButton.prototype.createSvg = function(type) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS(null, 'version', '1.1');

    var innerSVG = window.janframe.icons.svg[this.type];
    var dXML = new DOMParser();
    sXML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' + innerSVG + '</svg>';
    /*
    var svgDocElement = dXML.parseFromString(sXML, "image/svg+xml");

    var childNode = svgDocElement.documentElement;
    var childNode = childNode.firstChild;
    while(childNode) {
        svg.appendChild(svg.ownerDocument.importNode(childNode, true));
        childNode = childNode.nextSibling;
    }

    svg.appendChild(this.svgBackground());
    return svg;
    */
    return sXML;
};

oButton.prototype.svgBackground = function() {
  var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.style.fill = '#000';
  rect.id = 'b' + this.name;
  rect.setAttributeNS(null, 'x', '0');
  rect.setAttributeNS(null, 'y', '0');
  rect.setAttributeNS(null, 'ry', '3.5');
  rect.setAttributeNS(null, 'rx', '3.5');
  rect.width = '20';
  rect.height = '20';
  return rect;
  //return '<rect style="fill:#000" id="b'+this.name+'" x="0" y="0" width="20" height="20" ry="3.5" rx="3.5" />';
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