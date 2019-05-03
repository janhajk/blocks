var buttonAdd = function(type,title,target) {  
  buttonAdd.parent.init.call(this,type,title,target,'a');
};
buttonAdd.prototype             = new oButton();
buttonAdd.prototype.constructor = oButton;
buttonAdd.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonAdd.prototype.click = function() {
  $('#wysiwyg'+this.name).html('');
  this.dialog();
  if (this.wysiwygInstance === undefined) {
    this.wysiwygInstance = new nicEditor({fullPanel : true});
    this.wysiwygInstance.setPanel('wysiwygpanel'+this.name);
    this.wysiwygInstance.addInstance('wysiwyg'+this.name);
  }
  $('#wysiwyg'+this.name).focus();
};


/**
 * Erstellt den Wysiwyg Editor zum Erstellen von Content
 * - #wysiwyg
 * ---- #wysiwyg-textarea
 */
buttonAdd.prototype.dialog = function() {
  var me = this;
  if ($('#wysiwyg'+me.name).length === 0) {
    janframeDialog(me.name, '<div style="width:100%"><div id="wysiwygpanel'+me.name+'" style="width:100%"></div><div id="wysiwyg'+me.name+'" style="height:300px;color:black;background:white;padding:5px;margin-right:-2px;border:gray solid 1px;" class="noShortcuts"></div></div>');
  }
  $('#dialog'+me.name).dialog({
    autoOpen: true,
    width   : 600,
    modal   : true,
    title   : 'Neuer Eintrag erstellen',
    buttons : {
      'als Titel speichern' : function () {
        var data = {
          content : ($('#wysiwyg'+me.name).html()).replace(/<(?:.|\n)*?>/gm, ''),
          parents : [l.data.selected],
          type    : 0
        };
        (new element(data)).createNew();
        $(this).dialog('close');
      },
      'als Content speichern' : function () {
        var data = {
          content : $('#wysiwyg'+me.name).html(),
          parents : [l.data.selected],
          type    : 1
        };
        (new element(data)).createNew();
        $(this).dialog('close');
      },
      'Abbrechen': function() {
        $(this).dialog('close');
      }
    }
  });
};