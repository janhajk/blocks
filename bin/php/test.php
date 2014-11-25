<?php
if (isset($_GET['test'])) {
  if (!$_SESSION['logged']) return null;
  test();
}

function test() {
  test_usr();
  exit();
}
?>
