
<?php
  include_once('config.inc');
  session_start();
  if (isset($_SESSION['logged']) &&  $_SESSION['logged']){
    header("Location: ".$GLOBALS['janrain_tokenurl']);
    exit;
  }

?>
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=440, height=device-height, initial-scale=1" />

    <script type="text/javascript">
      (function() {
          if (typeof window.janrain !== 'object') window.janrain = {};
          if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};

          janrain.settings.tokenUrl = '<?php print $GLOBALS['janrain_tokenurl'] ?>';

          function isReady() { janrain.ready = true; };
          if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", isReady, false);
          } else {
            window.attachEvent('onload', isReady);
          }

          var e = document.createElement('script');
          e.type = 'text/javascript';
          e.id = 'janrainAuthWidget';

          if (document.location.protocol === 'https:') {
            e.src = 'https://rpxnow.com/js/lib/janschaer/engage.js';
          } else {
            e.src = 'http://widget-cdn.rpxnow.com/js/lib/janschaer/engage.js';
          }

          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(e, s);
      })();
    </script>
</head>
<body>
  <div id="signin" style="position:absolute;left:50%;top:50%;margin:-78px 0 0 -190px;">
    <div id="janrainEngageEmbed">
    </div>
  </div>
</body>
</html>