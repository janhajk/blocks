<?php

if (isset($_GET['backup'])) {
  header("content-type: application/json");
  if (!$_SESSION['logged']) {
    print json_encode(0);
  }
  else {
    backup();
  }
}

/**
 * Erstellt ein Backup 
 */
function backup() {
  $cmd = $GLOBALS['pathmysqldump']." -u".$GLOBALS['mysql_user']." -p".$GLOBALS['mysql_password']." -h localhost ".$GLOBALS['default_table']." | gzip > ".dirname(__FILE__)."/../../var/backups/BKP_".date('Y-m-d').".gz";
  system($cmd, $fp); 
  print json_encode($fp==0?1:0);
  //print $cmd;
  exit();
}
?>
