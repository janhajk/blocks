var buttonEdit = function(type,title,target) {  
  buttonEdit.parent.init.call(this,type,title,target,'e');
  var me = this;
  $('.scontent').live('dblclick', function(){me.click();});
  
};
buttonEdit.prototype             = new oButton();
buttonEdit.prototype.constructor = oButton;
buttonEdit.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonEdit.prototype.click = function() {
  this.dialog();
  if (this.wysiwygInstance === undefined) {
    this.wysiwygInstance = new nicEditor({fullPanel : true});
    this.wysiwygInstance.setPanel('wysiwygpanel'+this.name);
    this.wysiwygInstance.addInstance('wysiwyg'+this.name);
  }
  $('#wysiwyg'+this.name).html(l.data.data[l.data.selected].content);
  $('#wysiwyg'+this.name).focus();
};

/**
 * Erstellt den Wysiwyg Editor zum Editieren von Content
 * - #wysiwyg 
 * ---- #wysiwyg-textarea
 */
buttonEdit.prototype.dialog = function() {
  var me = this;
  if ($('#wysiwyg'+me.name).length === 0) {
    janframeDialog(me.name, '<div style="width:100%"><div id="wysiwygpanel'+me.name+'" style="width:100%"></div><div id="wysiwyg'+me.name+'" style="height:300px;color:black;background:white;padding:5px;margin-right:-2px" class="noShortcuts"></div></div>');
  }
  $('#dialog'+me.name).dialog({
    autoOpen: true,
    width   : 600,
    modal   : true,
    title   : 'Eintrag bearbeiten',
    buttons : {
      'speichern' : function () {
        l.data.data[l.data.selected].updateContent($('#wysiwyg'+me.name).html());
        $(this).dialog('close');
      },
      'schliessen': function() {
        $(this).dialog('close');
      }
    }
  });
};