var buttonParent = function(type,title,target) {  
  buttonParent.parent.init.call(this,type,title,target);
};
buttonParent.prototype             = new oButton();
buttonParent.prototype.constructor = oButton;
buttonParent.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonParent.prototype.click = function() {
  this.dialog();
};


/**
 * Dialog
 */
buttonParent.prototype.dialog = function() {
  var me = this;
  janframeDialog(me.name, '<p>Neue Parent-ID: <input type="text" id="input'+me.name+'" class="noShortcuts"></p>');
  $('#dialog'+me.name).dialog({
    autoOpen : true,
    modal    : true,
    draggable: false,
    title    : 'Neue Parent-ID eingeben',
    closeText: 'Abbrechen',
    buttons  : {
      'speichern': function() {
        l.data.updateParent($('#input'+me.name).val());
        $(this).dialog('destroy');
        $('#dialog'+me.name).remove();
      },
      'abbrechen': function() {
        $(this).dialog('destroy');
        $('#dialog'+me.name).remove();
      }
    }
  });
};


/**
 * Datensatz löschen
 */
data.prototype.updateParent = function(pid) {
  var me  = this;
  var options = {
    action : 'parent',
    id     : this.selected,
    id2    : pid
  };
  $.post(this.target, options, function() { 
    me.get();
  }, 
  'json');
};