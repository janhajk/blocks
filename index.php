<?php
include_once('config.inc');
session_start();

$GLOBALS['db'] = null;

// Core Functions
include_once 'bin/php/db.php';
include_once 'bin/php/functions.php';

/**
 * Public Aktionen
 */
if (isset($_GET['public'])) {
  if ($_POST['action'] === 'islogged') json_short_out($_SESSION['logged']);
  exit(); // Auf Ebene Public können keine weiteren Aktionen durchgeführt werden
}


// Include Icons-Pack in Javascript Array
if (!supportsSvg()) {
  $icons = file_list('bin/images/icons/button/png', '.png');
  foreach ($icons as $icon) {
    $GLOBALS['jsvars']['icons']['png'][array_shift(explode('.',$icon))] = base64_encode(file_get_contents('bin/images/icons/button/png/'.$icon));
  }
}
else {
  $icons = file_list('bin/images/icons/button/svg', '.svg');
  foreach ($icons as $icon) {
    $val = explode('.', $icon);
    $GLOBALS['jsvars']['icons']['svg'][array_shift($val)] = file_get_contents('bin/images/icons/button/svg/'.$icon);
  }
}

// Klassen
include_once 'bin/php/observer.php';

// Additional Functions
include_once 'bin/php/backup.php';
include_once 'bin/php/cron.php';
include_once 'usr/php/usr.cron.php';
include_once 'usr/php/usr.test.php';
include_once 'bin/php/test.php';

// Standard Function
include_once 'bin/php/content.php';
include_once 'usr/php/usr.content.php';
include_once 'bin/php/page.php';
include_once 'bin/php/user.php';


// Login
if (!session_active()) {
  if ((!isset($_SESSION['logged']) || !$_SESSION['logged']) && !isset($_POST['token'])) {
    header("Location: ".$GLOBALS['janrain_tokenurl'].'/login.php');
    exit();
  }
}
elseif (session_active()) {
  $_SESSION['logged'] = true;
}

/**
 * Login
 * Weiterleitung ist nötig, damit die POST Daten bei
 * aktualisieren nicht immer wieder gesendet werden.
 */
if (isset($_POST['token'])) {
  login();
  header("Location: ".$GLOBALS['janrain_tokenurl']);
  exit();
}

/*
 * Logged-Aktionen
 */
else {
  if (isset($_GET['ajax'])) {
    if ($_SESSION['logged']) {
      ajax();
    }
  }
  else {
    html();
  }
}
