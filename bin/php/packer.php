<?php

include_once('../../config.inc');
include_once 'functions.php';
include_once '../../lib/jspacker/class.JavaScriptPacker.php';
include_once('db.php');


header('Content-Type: text/javascript');
header('Content-language: en');


if (!$GLOBALS['jscache']) {
  ob_start();
  ob_start('ob_gzhandler');
  print getContent();
  $compLength = ob_get_length();
  header('Content-Length: ' . $compLength);
  ob_end_flush();
  exit();
}

ob_start();
//ob_start('ob_gzhandler');

$valid = 60*60; // in Sekunden
print jsPacker();
//ob_end_flush();

$compLength     = ob_get_length();
$jscode         = ob_get_contents();
ob_end_clean();
 
$HashID         = md5($jscode); 
$LastChangeTime = getExpires()-$valid; 
$ExpireTime     = $valid; 
$headers        = apache_request_headers();

header('Cache-Control: max-age=' . $ExpireTime); // must-revalidate
header('Expires: '.gmdate('D, d M Y H:i:s', time()+$ExpireTime).' GMT');
header('Last-Modified: '.gmdate('D, d M Y H:i:s', $LastChangeTime).' GMT');
header('ETag: ' . $HashID);
$PageWasUpdated = !(isset($headers['If-Modified-Since']) && strtotime($headers['If-Modified-Since']) == $LastChangeTime);
$DoIDsMatch = (isset($headers['If-None-Match']) && ereg($HashID, $headers['If-None-Match']));
if (!$PageWasUpdated or $DoIDsMatch){
  header('HTTP/1.1 304 Not Modified');
  header('Connection: close');
}
else {
  header('HTTP/1.1 200 OK');
  header('Content-Length: ' . $compLength);
  print $jscode;
}


function jsPacker() {
  $db = new DB_MySQL();
  global $valid;
  $db->query("SELECT timestamp  AS t, content AS c FROM sub_cache WHERE id = 'javascript' LIMIT 0,1");
  if ($db->num()) {
    $r = $db->fetchRow();
    return ($r['t'] - time() > 0) ? '/* Cached Version from '.date("Y-m-d H:i", $r['t']-$valid).' valid until '.date("Y-m-d H:i", $r['t']).'  */'."\n".base64_decode($r['c']) : cacheReset();
  }
  return cacheReset();
}

function cacheReset() {
  $db = new DB_MySQL();
  global $valid;
  $content = getContent();
  $db->query("DELETE FROM sub_cache WHERE id LIKE 'javascript'");
  $valid = time()+$valid;
  $db->query("INSERT INTO sub_cache (id,timestamp,content) VALUES ('javascript','$valid','".base64_encode($content)."')");
  return $content;
}

function getContent() {
  $j = '';
  $files = array_diff(scandir('../js'), array('.', '..'));
  foreach ($files as $file) {
    $j .= file_get_contents('../js/'.$file) . ' ';
  }
  $files = array_diff(scandir('../../usr/js'), array('.', '..'));
  foreach ($files as $file) {
    $j .= file_get_contents('../../usr/js/'.$file) . ' ';
  }
  if ($GLOBALS['packer']=='jspacker') {
    $packer = new JavaScriptPacker($j, 'High ASCII', true, true);
    $j = $packer->pack();
  }
  return $j;
}

function getExpires() {
  $db = new DB_MySQL();
  $db->query("SELECT timestamp  AS t FROM sub_cache WHERE id = 'javascript' LIMIT 0,1");
  if ($db->num()) {
    $r = $db->fetchRow();
    return ($r['t'] - time() > 0) ? $r['t'] : false;
  }
  return false;
}
?>