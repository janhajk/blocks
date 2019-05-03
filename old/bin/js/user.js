var user = function() {
  this.renderLoginLink();
};


user.prototype.renderLoginLink = function() {
    $.post('?public', {
        action: 'islogged'
    }, function(data) {
        if(data === 1) { // Ist eingeloggt, dann Logout zeigen
            $('#signin').hide();
            var div;
            div = document.createElement('div');
            div.style.float = 'right';
            div.style.marginRight = '10px';
            div.style.marginTop = '5px';
            var a;
            a = document.createElement('a');
            a.href = 'javascript:';
            a.id = 'logout';
            a.textContent = 'Logout';
            a.onclick = function() {
                $.post(janframe.ajax_target, {
                    action: 'logout'
                }, function() {
                    window.location.reload();
                });
            };
            div.appendChild(a);
            document.getElementById('header').appendChild(div);
        }
    }, 'json');
};