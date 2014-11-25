<?php


/**
 * Aktualisiert das Datum eines Eintrages
 * ist noch kein Eintrag vorhanden, dann wird er erstellt
 * @global type $db Die Datenbankverbindung
 * @param type $id die ID des Eintrages
 * @param type $date das Datum in Format dd.mm.YY
 */
function updateDate($id, $date) {
  global $db;
  if ($date === '') {
    $db->query('DELETE FROM sub_date WHERE cid = '.$id);
    return true;
  }
  $date = (int) strtotime($date);
  $db->query("SELECT * FROM sub_date WHERE cid = ".$id);
  if ($db->fetchRow()) {
    $db->query("UPDATE sub_date SET date = $date WHERE cid = ".$id);
  }
  else {
    $db->query("INSERT INTO sub_date (cid,date) VALUES ($id,$date)");
  }
}

/**
 * Entfernt ein Datum eines Eintrages
 * @global type $db
 * @param type $cid 
 */
function removeDate($cid) {
  global $db;
  $db->query("DELETE FROM sub_date WHERE cid = '$cid'");
}




?>
