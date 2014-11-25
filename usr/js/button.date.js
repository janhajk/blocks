var buttonDate = function(type,title,target) {
  buttonDate.parent.init.call(this,type,title,target,'d');
};
buttonDate.prototype             = new oButton();
buttonDate.prototype.constructor = oButton;
buttonDate.parent                = oButton.prototype;


/**
 * Click Event
 */
buttonDate.prototype.click = function() {
  var d = l.data.data[l.data.selected].date,
      title = 'Datum hinzuf&uuml;gen';
  if (d !== null) {
    d = new Date(d*1000);
    title = 'Datum bearbeiten';
  }
  else {d = '';}
  this.dialog(title, d);
};


/**
 * Datums-Dialog-Box
 * benutzt jquery-UI Dialog
 */
buttonDate.prototype.dialog = function(title, date) {
  var me = this;
  janframeDialog(me.name, '<p>Datum: <input type="text" id="datepicker'+me.name+'" class="noShortcuts"></p>');
  $('#datepicker'+me.name).datepicker({
    dateFormat : 'dd.mm.yy',
    firstDay   : 1,
    defaultDate: date
  });
  $('#datepicker'+me.name).datepicker("setDate", date);
  $('#dialog'+me.name).dialog({
    autoOpen : true,
    modal    : true,
    draggable: false,
    title    : title,
    closeText: 'Abbrechen',
    buttons  : {
      'speichern': function() {
        l.data.updateDate(l.data.selected, $('#datepicker'+me.name).val());
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
 * Datum ändern
 */
data.prototype.updateDate = function(id, date) {
  var me  = this;
  var options = {
    action : 'date',
    id     : id,
    date  : date
  };
  $.post(this.target, options, function() {
    me.get();
  },
  'json');
};