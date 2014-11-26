/*
 * Baut die HTML-Seite auf
 */
var htmlConstruct = function() {

    // configure HTML-<head>
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

     this.browser = getBrowser();
    //this.browser = 'mobile';  // for testing mobile
    // Add some additional CSS Files
    if(this.browser === 'mobile') {
        addCssFile('bin/css/styles.mobile.css');
    } else {
        addCssFile('bin/css/styles.css');
    }
    addCssFile('lib/jquery/css/' + window.janframe.jqueriuitheme + '/jquery-ui.css');

    var div1, div2, div3;
    // Overlay for editing mode
    div1 = document.createElement('div');
    div1.id = 'overlay';
    div1.class = 'ui-widget-overlay';
    div1.style.display = 'none';
    document.body.appendChild(div1);

    // Content Wrapper
    div1 = document.createElement('div');
    div1.id = 'wrapper';
    div2 = document.createElement('div');
    div2.id = 'header';
    div3 = document.createElement('div');
    div3.id = 'middle';
    div1.appendChild(div2);
    div1.appendChild(div3);
    document.body.appendChild(div1);

    // Pacman-Loader
    pacman = new loader();

    // Message Box
    this.msgDOM();

    // If menu is defined in usr scripts, then execute
    if(typeof this.createMenu === 'function') {
        this.createMenu();
    }
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