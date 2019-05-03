<?php
function ajax() {  
  header("content-type: application/json");
  ob_start("ob_gzhandler"); 
  
  if (isset($_POST['action']) && $_POST['action'] === 'logout') {
    logout();
  }
  
  content_usr();
}
?>