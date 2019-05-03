<?php
/**
 * Funktion is called at ?cron
 * @global DB_MySQL $db 
 */
if (isset($_GET['cron'])) {
  header("content-type: application/json");
  if (!$_SESSION['logged']) {
    print json_encode(false);
  }
  else {
    cron();
  }
  exit();
}

function cron() {
//  global $db;
//  $db = new DB_MySQL();
//  $db->query("SELECT * FROM contents ORDER BY id ASC");
//  $all = $db->fetchAll();
//  foreach ($all as $r) {
//    $cid = $r['contentid'];
//    $db->query("SELECT kid FROM blocks WHERE contentid = ".((int) $cid)." LIMIT 0,1");
//    $kid = $db->fetchSingleFirst();
//    $db->query("UPDATE contents SET bid = ".$kid." WHERE id=".$r['id']);
//  } 
}

?>
