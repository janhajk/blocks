<?php
function cron_usr() {
  global $db;
  $children = array();
  $db = new DB_MySQL();
  $db->query("SELECT * FROM sub_revisions ORDER BY kid ASC");
  $all = $db->fetchAll();
  $prekid = 92;
  $i = 0;
  foreach ($all as $r) {
    if ($prekid != $r['kid']) { $prekid = $r['kid']; $i++; }
    $db->query("INSERT INTO values (valid,vid,content) VALUES ($i,".((int) $r['vid']).",'".$r['content']."')");
    $db->query("UPDATE blocks SET valid = ".$i." WHERE kid=".$r['kid']);
  } 
}
?>
