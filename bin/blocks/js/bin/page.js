/**
 * Baut die HTML-Seite auf
 */
var htmlConstruct = function() {
  this.browser = this.getBrowser();
  //this.browser = 'mobile';  // for testing mobile
  this.css();
  this.setHTMLHeader();
  this.msg();
  $('body').append('<div id="overlay" class="ui-widget-overlay" style="display:none"></div>');
  $('body').append('<div id="wrapper"><div id="header"></div><div id="middle"></div></div>');
  pacman = new loader();
  if(typeof this.createMenu === 'function') {this.createMenu();}
};

/**
 * Lädt eine CSS Datei in die HTML-Seite
 */
htmlConstruct.prototype.loadCSS = function(link) {
  $('head').append('<link rel="stylesheet" type="text/css" href="'+link+'" />');
};

/**
 * setzt die HTML-Header Eigenschaften
 */
htmlConstruct.prototype.setHTMLHeader = function() {
  var icon       = 'usr/images/favicons/'+window.janframe.page_icon;
  document.title = window.janframe.page_title;
  
  $('html').attr({lang:'de'});
  $('head').append('<meta charset="utf-8" />');
  $('head').append('<link rel="icon"             href="usr/images/favicons/favicon.ico" />');
  $('head').append('<link rel="apple-touch-icon" href="'+icon+'_57x57.png" />');
  $('head').append('<link rel="apple-touch-icon" href="'+icon+'_72x72.png" sizes="72x72" />');
  $('head').append('<link rel="apple-touch-icon" href="'+icon+'_114x114.png" sizes="114x114" />');
  $('head').append('<link rel="shortcut icon"    href="'+icon+'_57x57.png">'); 
  
  if (this.browser === 'mobile') {
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.3" />');
  }
  
};

/**
 * Lädt CSS Dateien
 */
htmlConstruct.prototype.css = function() {
  if (this.browser === 'mobile') {
    this.loadCSS('http://wiki.janschaer.ch/bin/css/styles.mobile.css');
  }
  else {
    this.loadCSS('http://wiki.janschaer.ch/bin/css/styles.css'); 
  }
  this.loadCSS('http://wiki.janschaer.ch/lib/jquery/css/'+window.janframe.jqueriuitheme+'/jquery-ui.css');
};

/**
 * gets the Browser-Type
 */
htmlConstruct.prototype.getBrowser = function() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("android") !== -1) {
    return 'mobile';
  }
//  else if (ua.indexOf("chrome") !== -1){
//    return 'chrome';
//  }
  return 'generic';
};

/**
 * erstellt das Message DIV für Informationsanzeigen
 */
htmlConstruct.prototype.msg = function() {
  var style = [
    'position:absolute',
    'width:200px',
    'min-height:20px',
    'margin:0',
    'margin-left:-100px',
    'padding:5px 10px',
    'left:50%',
    'top:0px',
    'background:#F9EDBE',
    'color:white',
    'border-radius:4px',
    'border:1px solid gray',
    'color:black',
    'font-weight:bold',
    'display:none',
    'text-align:center',
    'vertical-align: middle',
    'z-index:9999'
  ].join(';');
  $('body').append('<div id="msg" style="'+style+';"><span id="msgtxt"></span></div>');
};

/**
 * Message-DIV Text aktualisieren
 */
htmlConstruct.prototype.msg = function(text) {
  $('#msg').slideDown(100);
  document.getElementById('msgtxt').innerHTML = text;
  $('#msg').delay(8000).fadeOut(1000);
};