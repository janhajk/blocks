<?php
function test_usr() {
  header('content-type: text/html; charset=utf-8');
  include_once('lib/finediff.php');
  $from = "Die Vertragsparteien verpflichten sich, weder Dritten Vorteile irgendwelcher Art direkt oder indirekt anzubieten, noch für sich oder andere direkt oder indirekt Geschenke entgegenzunehmen oder sich sonstige Vorteile zu verschaffen oder versprechen zu lassen.";
  $to   = "Die Vertragsparteien lassen sich verpflichten, wder Dritten Vorteile irgendwelcher direkt oder indirekt anzubieten, noch für sich oder andere direkt oder indirekt Geschenke entgegenzunehmen oder sich sonstige zu verschaffen oder versprechen zu lassen.";
  $opcodes = FineDiff::getDiffOpcodes(utf8_encode($from), utf8_encode($to));
  print (utf8_encode(FineDiff::renderDiffToHTMLFromOpcodes($from, $opcodes)));
}
?>
