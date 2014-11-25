var buttonPrint = function(type,title,target) {  
  buttonPrint.parent.init.call(this,type,title,target);
};
buttonPrint.prototype             = new oButton();
buttonPrint.prototype.constructor = oButton;
buttonPrint.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonPrint.prototype.click = function() {
  (new this.print(l.data.selected)).open();
};


buttonPrint.prototype.print = function(cid) {

  this.open = function() {
    var w = window.open('', '', serialize(options));
    w.document.write('<html><head><link rel="stylesheet" type="text/css" href="usr/css/print.css"></head><body>'+chapterRecursive(cid,1)+'</body></html>');
  };
  
  var options = {
    dependent : 'yes',
    height    : '400',
    width     : '600',
    location  : 'no',
    resizable : 'yes',
    scrollbars: 'yes'
  },
  
  hr = function (nr) {
    return '<hr style="height:'+nr+'" />';
  },
  
  chapterRecursive = function(id, level) {
    var data = l.data.data, chapter = data[id], c, html='', children = [];
    html = '<h' + level + '>' + chapter.content + '</h' + level + '>';
    // Content
    children = l.data.getChildren(id,1);
    for (c in children) {
      html += '<div>' + data[children[parseInt(c)].cid].formatForOutput() + '</div>';
    }
    children = l.data.getChildren(id,0);
    // Subchapters
    for (c in children) {
      html += chapterRecursive(children[c].cid, level+1);
    }
    return html;
  },
  
  /**
   * Wandelt ein JS-Object in ein String um, 'key1=value1,key2=value2,...'
   */
  serialize = function(o) {
    var s = [], i;
    for (i in o) {s.push([i,o[i]].join('='));}
    return s.join(',');
  };  
};