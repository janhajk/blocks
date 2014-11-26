Date.createFromMysql = function(mysql_string)
{ 
   if(typeof mysql_string === 'string')
   {
      var t = mysql_string.split(/[\- :]/);

      //when t[3], t[4] and t[5] are missing they defaults to zero
      return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);          
   }

   return null;   
};


/**
 * Wandelt ein Timestamp in ein Lesbares Datum um, exp: '14. März 2012'
 */
var renderTimestamp = function(timestamp) {
  var datum = new Date(timestamp*1000),
  monat = ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni','Juni','Juli','August','September','Oktober','November','Dezember'];
  return datum.getDate() + '. ' + monat[datum.getMonth()] + ' ' + datum.getFullYear() + ' - ' + datum.getHours() + ':' + datum.getMinutes();
};


/**
 * Gibt zurück, ob der Browser SVG unterstüzt
 */
var supportsSVG = function() {
  return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
};


/**
 * Add Raw CSS to page header
 */
var addCssPlain = function(cssCode) {
    var style = document.createElement('style');
    style.type = 'text/css';
    if(style.styleSheet) {
        style.styleSheet.cssText = cssCode;
    } else {
        style.appendChild(document.createTextNode(cssCode));
    }
    (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
};

/*
 * Add CSS files to page header
 */
var addCssFile = function(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    (document.head || document.getElementsByTagName('head')[0]).appendChild(link);
};

var janframeDialog = function(name, content) {
  $('body').append('<div id="dialog'+name+'">'+content+'</div>');
};

var uniqueId = function() {
  return (new Date().getTime()).toString() + (Math.floor(Math.random()*100000)).toString();
};


/**
 * returns the Browser-Type
 */
var getBrowser = function() {
    var ua = navigator.userAgent.toLowerCase();
    if(ua.indexOf('android') !== -1) {
        return 'mobile';
    }
    //  else if (ua.indexOf('chrome') !== -1){
    //    return 'chrome';
    //  }
    return 'generic';
};

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function(dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.epoch-calendar.com */

	dowOffset = typeof(dowOffset) === 'int' ? dowOffset : 0; //default dowOffset to zero
	var newYear = new Date(this.getFullYear(),0,1),
	day = newYear.getDay() - dowOffset, //the day of week the year begins on
	daynum = Math.floor((this.getTime() - newYear.getTime() - 
	(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1,
	weeknum, nYear, nday;
  day = (day >= 0 ? day : day + 7);
	//if the year starts before the middle of a week
	if(day < 4) {
		weeknum = Math.floor((daynum+day-1)/7) + 1;
		if(weeknum > 52) {
			nYear = new Date(this.getFullYear() + 1,0,1);
			nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/*if the next year starts before the middle of
			  the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53;
		}
	}
	else {
		weeknum = Math.floor((daynum+day-1)/7);
	}
	return weeknum;
};


/**
 * Dynamically load javascript Files
 */
var loadScript = function(url, callback){
  var script = document.createElement("script");
  script.type = "text/javascript";
  if (script.readyState){  //IE
      script.onreadystatechange = function(){
          if (script.readyState === "loaded" || script.readyState === "complete"){
              script.onreadystatechange = null;
              callback();
          }
      };
  } else {  //Others
      script.onload = function(){
          callback();
      };
  }
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

/**
 * Simply SVG-Code. Pretty much just rounds the coordinates
 */
var simpsvg = function(s) {
  var parts = s.split(' '), result = '', i;
  for (i in parts) {
    if (parts[i].charCodeAt(0) >= 65 && parts[i].charCodeAt(0) <= 122) result += parts[i] + ' ';
    else {
      var set = parts[i].split(',');
      set[0] = Math.round(parseFloat(set[0])*2)/2;
      set[1] = Math.round(parseFloat(set[1])*2)/2;
      result += set[0] + ',' + set[1] + ' '; 
    }
  }
  return result;
};