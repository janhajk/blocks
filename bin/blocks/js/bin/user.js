var user = function() {
  this.renderLoginLink(); 
};


user.prototype.renderLoginLink = function() {
  $.post('?public', {action:'islogged'}, function(data) {
    
    if (data===1) { // Ist eingeloggt, dann Logout zeigen
      $('#signin').hide();
      $('#header').append('<div style="float:right;margin-right:10px;margin-top:5px"><a id="logout" href="#">Abmelden</a></div>');
      $('#logout').on('click', function() {
        $.post(janframe.ajax_target,{action:'logout'}, function(){
          window.location.reload();
        });
      });
    }
  },'json');
};