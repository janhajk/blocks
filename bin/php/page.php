<?php

/**
 * Generates the HTML Page Construct
 * @global type $packer 
 */
function html() {
  
  print 
  '<!DOCTYPE html>'.  
  '<html>'.
    '<head>'.
      JS_vars().
    '</head>'.     
    '<body>'.
        getJquery().JS().
      '<script src="lib/niceditor/nicEdit.js" type="text/javascript"></script>'.
      '<script src="lib/diff/diff_match_patch.js" type="text/javascript"></script>'.
    '</body>'.
  '</html>';
}

function getJquery() {
  if ($GLOBALS['useGoogleJs']) {
    return '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>'.
           '<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.min.js"></script>';
  }
  return   '<script type="text/javascript" src="lib/jquery/jquery.js"></script>';
}

/**
 * Returns Javascript Files
 * @global type $packer If true, javascriped is packed into one file
 * @return string <script type...>
 */
function JS() {
  if ($GLOBALS['packer'] !== 'none') {
    return '<script type="text/javascript" src="bin/php/packer.php"></script>';
  }
  else {
      $out = '';
      $files = array_diff(scandir('./bin/js'), array('.', '..', 'packer.php'));
      foreach ($files as $file) {
        $out .= '<script type="text/javascript" src="bin/js/'.$file.'"></script>';
      }
      $files = array_diff(scandir('./usr/js'), array('.', '..', 'packer.php'));
      foreach ($files as $file) {
        $out .= '<script type="text/javascript" src="usr/js/'.$file.'"></script>';
      }      
      return $out;
  }
}

function JS_vars() {
  return 
    '<script type="text/javascript">'.
    'window.janframe = ( '.json_encode($GLOBALS['jsvars']).');'.
    '</script>';
}

?>