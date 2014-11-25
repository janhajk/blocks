var buttonBackup = function(type,title,target) {
  buttonBackup.parent.init.call(this,type,title,target);
};
buttonBackup.prototype             = new oButton();
buttonBackup.prototype.constructor = oButton;
buttonBackup.parent                = oButton.prototype;


/**
 * Click Event
 */
buttonBackup.prototype.click = function() {
  $.post('?backup', function(data){
    html.msgUpdate( data === 0 ? 'Es gab ein Fehler!' : 'Backup wurde erstellt!');
  },'json');
};