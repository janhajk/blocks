function simpsvg(s) {
var parts = s.split(' ');
var result = '';
for (var i in parts) {
  if (parts[i].charCodeAt(0) >= 65 && parts[i].charCodeAt(0) <= 122) result += parts[i] + ' ';
  else {
    var set = parts[i].split(',');
    set[0] = Math.round(parseFloat(set[0])*10)/10;
    set[1] = Math.round(parseFloat(set[1])*10)/10;
    result += set[0] + ',' + set[1] + ' '; 
  }
}
return result;
}

/**
 * Gibt den Inhalt als Array des vorgegebenen Pfades zurück 
 * für ein Chapter Element
 * @param data Object Das Array mit den Daten
 * @param path string ein Pfad zu den Daten, z.B. '1-4-22-34'
 */
var arrayChapter = function(data, path) {
  var splitPath = function(path) {
    if (path.indexOf('-')==-1) return [path];
    var parts = path.split('-');
    return {
      first:parts.shift(),
      last:parts.join('-')
      };
  };
  if (!path) return data;
  var levels, cPath;
  levels = path.split('-').length;
  cPath = splitPath(path);
  while (levels > 0) {
    return arrayChapter(data[getArrayKeyFromKid(data,levels==1?path:cPath.first)].children, levels==1?false:cPath.last);
  }
};

var getArrayKeyFromKid = function(data,kid) {
  for (var i=0, len = data.length; i<len; i++) {
    if (data[i].kid == kid) {
      return i;
    }
  }
  return false;
};


var objectFromPath = function(data, path) {
  if (!path) return data;
  var levels, cPath;
  levels = path.split('-').length;
  if (levels==1 && path.indexOf('_')!=-1) {
    var parts = path.split('_');
    return objectFromPath(data.children[parts[0]].content[parts[1]],false);
  }
  if (data.children != undefined) data = data.children;
  cPath = splitPath(path);
  while (levels > 0) {
    return objectFromPath(data[levels==1?path:cPath.first], levels==1?false:cPath.last);
  }
};


  /**
   * Versteckt die Ebenen, welche nicht verwendet werden
   */
  var hideSubLevels = function() {
    var levels = liste.tree.options.path.levels(), i;
    for (i = levels+1; i<maxlevels; i++) {
      $('#level'+i).hide();
    }
  };
  
  
  
  var tree =  function(liste) {
  this.data = {};
  var target = './?ajax';
  /**
   * Options for tree
   */
  this.options = {
    action  : 'load',
    id      : 0,
    path    : new path(window.location.hash!=''?window.location.hash.substring(7):''),
    content : '',
    type    : '',
    setPath : function(p) {this.path.set(p)},
    update  : function(options) {var o; for (o in options) { this[o] = options[o]; }},
    get     : function(){ return {action:this.action,id:this.id,type:this.type,content:this.content}}
  };
  
  /**
   * AJAX Aktion zum laden von JSON data
   */
  this.get = function() {
    var tree = this;
    $.post(target, {action:'load'}, function(data) { 
        tree.data = data.content;
        liste.refresh();  
      }, 
      'json');
  };
  
  /**
   * AJAX Aktionen zum Editieren/Altern der Liste
   */
  this.alter = function() {
    var tree = this;
    $.post(target, this.options.get() , function(data){
      if (tree.options.action == 'remove' && tree.options.type == 'chapter') {
        //tree.options.path.up();
      }
      if (data !== '') { 
        //tree.options.path.set(tree.options.path.get() + '-' + data); 
      }
      liste.tree.get();
      liste.refresh();
    });
  };


  /**
  * Sucht im Tree nach einer kapitel-ID und gibt das Kapitel-Objekt zurück
  * Initial-Data = l.tree.data.chapters
  */
  this.oChapterFromKid = function(data, kid) {
    var i=0, len = data.length, s;
    for (i;i<len;i++) {
      if (data[i].kid == kid) return data[i];
      s = this.oChapterFromKid(data[i].children, kid);
      if (typeof s === 'object') return s;
    }
    return 0;
  };
};





/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function($) { 
   $.fn.touchwipe = function(settings) {
     var config = {
    		min_move_x: 20,
    		min_move_y: 20,
 			wipeLeft: function() { },
 			wipeRight: function() { },
 			wipeUp: function() { },
 			wipeDown: function() { },
			preventDefaultEvents: true
	 };
     
     if (settings) $.extend(config, settings);
 
     this.each(function() {
    	 var startX;
    	 var startY;
		 var isMoving = false;

    	 function cancelTouch() {
    		 this.removeEventListener('touchmove', onTouchMove);
    		 startX = null;
    		 isMoving = false;
    	 }	
    	 
    	 function onTouchMove(e) {
    		 if(config.preventDefaultEvents) {
    			 e.preventDefault();
    		 }
    		 if(isMoving) {
	    		 var x = e.touches[0].pageX;
	    		 var y = e.touches[0].pageY;
	    		 var dx = startX - x;
	    		 var dy = startY - y;
	    		 if(Math.abs(dx) >= config.min_move_x) {
	    			cancelTouch();
	    			if(dx > 0) {
	    				config.wipeLeft();
	    			}
	    			else {
	    				config.wipeRight();
	    			}
	    		 }
	    		 else if(Math.abs(dy) >= config.min_move_y) {
		    			cancelTouch();
		    			if(dy > 0) {
		    				config.wipeDown();
		    			}
		    			else {
		    				config.wipeUp();
		    			}
		    		 }
    		 }
    	 }
    	 
    	 function onTouchStart(e)
    	 {
    		 if (e.touches.length == 1) {
    			 startX = e.touches[0].pageX;
    			 startY = e.touches[0].pageY;
    			 isMoving = true;
    			 this.addEventListener('touchmove', onTouchMove, false);
    		 }
    	 }    	 
    	 if ('ontouchstart' in document.documentElement) {
    		 this.addEventListener('touchstart', onTouchStart, false);
    	 }
     });
 
     return this;
   };
 
 })(jQuery);
