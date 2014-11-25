/*
 * Baut die HTML-Seite auf
 */
var htmlConstruct = function() {
    this.browser = this.getBrowser();
    //this.browser = 'mobile';  // for testing mobile
    this.css();
    this.setHTMLHeader();
    this.msgDOM();
    $('body').append('<div id="overlay" class="ui-widget-overlay" style="display:none"></div>');
    $('body').append('<div id="wrapper"><div id="header"></div><div id="middle"></div></div>');
    pacman = new loader();
    if(typeof this.createMenu === 'function') {
        this.createMenu();
    }
};



/**
 * Lädt eine CSS Datei dynamisch in die HTML-Seite
 */
htmlConstruct.prototype.loadCSS = function(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    (document.head || document.getElementsByTagName('head')[0]).appendChild(link);
};




/**
 * setzt die HTML-Header Eigenschaften
 */
htmlConstruct.prototype.setHTMLHeader = function() {
    document.title = window.janframe.page_title;

    document.documentElement.lang = 'de';

    var head = document.head || document.getElementsByTagName('head')[0];

    // Meta Tags
    var meta = document.createElement('meta');
    meta.httpEquiv = 'content-type';
    meta.content = 'text/html; charset=UTF-8';
    head.appendChild(meta);
    if(this.browser === 'mobile') {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.3';
        head.appendChild(meta);
    }

    // App Icons/Favicons
    var icon;
    var path = 'usr/images/favicons/' + window.janframe.page_icon;
    var icons = [
        ['icon', 'usr/images/favicons/favicon.ico'],
        ['apple-touch-icon', path + '_57x57.png'],
        ['apple-touch-icon', path + '_72x72.png'],
        ['apple-touch-icon', path + '_114x114.png'],
        ['shortcut icon', path + '_57x57.png'],
    ];
    for(var i = 0; i < icons.length; i++) {
        icon = document.createElement('link');
        icon.rel = icons[i][0];
        icon.href = icons[i][1] + '?v=1';
        icon.type = 'image/x-icon';
        head.appendChild(icon);
    }
};



/**
 * loads CSS Files
 */
htmlConstruct.prototype.css = function() {
    if(this.browser === 'mobile') {
        this.loadCSS('bin/css/styles.mobile.css');
    } else {
        this.loadCSS('bin/css/styles.css');
    }
    this.loadCSS('lib/jquery/css/' + window.janframe.jqueriuitheme + '/jquery-ui.css');
};


/**
 * returns the Browser-Type
 */
htmlConstruct.prototype.getBrowser = function() {
    var ua = navigator.userAgent.toLowerCase();
    if(ua.indexOf("android") !== -1) {
        return 'mobile';
    }
    //  else if (ua.indexOf("chrome") !== -1){
    //    return 'chrome';
    //  }
    return 'generic';
};


/*
 * The Message Area to send Messages to Client
 */
htmlConstruct.prototype.msgDOM = function() {
    var msg = document.createElement('div');
    msg.style.position = 'absolute';
    msg.style.width = '200px';
    msg.style.minHeight = '20px';
    msg.style.margin = '0';
    msg.style.marginLeft = '-100px';
    msg.style.padding = '5px 10px';
    msg.style.left = '50%';
    msg.style.top = '0px';
    msg.style.background = '#F9EDBE';
    msg.style.borderRadius = '4px';
    msg.style.border = '1px solid gray';
    msg.style.color = 'black';
    msg.style.fontWeight = 'bold';
    msg.style.display = 'none';
    msg.style.textAlign = 'center';
    msg.style.verticalAlign = 'middle';
    msg.style.zIndex = '9999';
    msg.id = 'msg';

    var span = document.createElement('span');
    span.id = 'msgtxt';

    msg.appendChild(span);

    document.body.appendChild(msg);

    /**
     * Update Message-Area
     */
    htmlConstruct.prototype.msg = function(text) {
        $(msg).slideDown(100);
        msg.innerHTML = text;
        $(msg).delay(8000).fadeOut(1000);
    };
};