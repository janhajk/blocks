var buttonTrash = function(type,title,target) {  
  buttonTrash.parent.init.call(this,type,title,target);
};
buttonTrash.prototype             = new oButton();
buttonTrash.prototype.constructor = oButton;
buttonTrash.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonTrash.prototype.click = function() {
  this.dialog();
};


/**
 * Löschen-Bestätigungs-Box
 * benutzt jquery-UI Dialog
 */
buttonTrash.prototype.dialog = function() {
  var me = this;
  janframeDialog(me.name, 'Willst Du den ausgew&auml;hlten Inhalt wirklich in den Papierkorb verschieben?');
  $('#dialog'+me.name).dialog({
    autoOpen : true,
    modal    : true,
    draggable: false,
    //title    : 'Papierkorb',
    closeText: 'Abbrechen',
    buttons  : {
      'ja': function() {
        l.data.data[l.data.selected].toTrash();
        $(this).dialog('destroy');
        $('#dialog'+me.name).remove();
      },
      'nein': function() {
        $(this).dialog('destroy');
        $('#dialog'+me.name).remove();
      }
    }
  });
};