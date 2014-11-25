<?php
/**
 * Gibt eine einzige Variable direkt als JSON-Code aus
 * boolean werden automatisch in 0/1 umgewandelt
 * String-Integer werden in wahre Integer umgewandelt
 * @param type $value 
 */
function json_short_out($value) {
  header("content-type: application/json");
  if ($value === true || $value === false) {
    $value = (int) $value;
  }
  elseif (is_string($value) && !preg_match('|[^0-9]|',$value))  {
    $value = (int) $value; // String-Integer umwandeln in richtige Integer 
  }
  print json_encode($value);
}

/**
 * 
 * @param string $d Directory
 * @param string $x Filesuffix, zb '.png'
 * @return type 
 */
function file_list($d, $x){ 
  foreach(array_diff(scandir($d), array('.', '..')) as $f) if (is_file($d . '/' . $f) && (($x) ? preg_match('/'.$x . '/' , $f) : 1)) $l[] = $f;
  return $l; 
}


function scanFileNameRecursivly($path = '', &$name = array() ) {
  $path = $path == ''? dirname(__FILE__) : $path;
  $lists = @scandir($path);
  if(!empty($lists)) {
    foreach($lists as $f) { 
      if(is_dir($path.DIRECTORY_SEPARATOR.$f) && $f != ".." && $f != ".") {
        scanFileNameRecursivly($path.DIRECTORY_SEPARATOR.$f, $name); 
      }
      else {
        $name[] = $path.DIRECTORY_SEPARATOR.$f;
      }
    }
  }
  return $name;
}

function validDate($sDate) {
  return (preg_match('|^\d\d\.\d\d\.\d{4}$|',$sDate) || $sDate === '');
}


function supportsSvg() {
  $b = getBrowser();
  if ($b['name'] === 'Google Chrome')         return true;
  elseif ($b['name'] === 'Mozilla Firefox')   return true;
  elseif ($b['name'] === 'Internet Explorer' && $b['version'] >= 9 ) return true;
  return false;
}


function getBrowser() 
{ 
    $u_agent = $_SERVER['HTTP_USER_AGENT']; 
    $bname = 'Unknown';
    $platform = 'Unknown';
    $version= "";

    //First get the platform?
    if (preg_match('/linux/i', $u_agent)) {
        $platform = 'linux';
    }
    elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
        $platform = 'mac';
    }
    elseif (preg_match('/windows|win32/i', $u_agent)) {
        $platform = 'windows';
    }
    
    // Next get the name of the useragent yes seperately and for good reason
    if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent)) 
    { 
        $bname = 'Internet Explorer'; 
        $ub = "MSIE"; 
    } 
    elseif(preg_match('/Firefox/i',$u_agent)) 
    { 
        $bname = 'Mozilla Firefox'; 
        $ub = "Firefox"; 
    } 
    elseif(preg_match('/Chrome/i',$u_agent)) 
    { 
        $bname = 'Google Chrome'; 
        $ub = "Chrome"; 
    } 
    elseif(preg_match('/Safari/i',$u_agent)) 
    { 
        $bname = 'Apple Safari'; 
        $ub = "Safari"; 
    } 
    elseif(preg_match('/Opera/i',$u_agent)) 
    { 
        $bname = 'Opera'; 
        $ub = "Opera"; 
    } 
    elseif(preg_match('/Netscape/i',$u_agent)) 
    { 
        $bname = 'Netscape'; 
        $ub = "Netscape"; 
    } 
    
    // finally get the correct version number
    $known = array('Version', $ub, 'other');
    $pattern = '#(?<browser>' . join('|', $known) .
    ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
    if (!preg_match_all($pattern, $u_agent, $matches)) {
        // we have no matching number just continue
    }
    
    // see how many we have
    $i = count($matches['browser']);
    if ($i != 1) {
        //we will have two since we are not using 'other' argument yet
        //see if version is before or after the name
        if (strripos($u_agent,"Version") < strripos($u_agent,$ub)){
            $version= $matches['version'][0];
        }
        else {
            $version= $matches['version'][1];
        }
    }
    else {
        $version= $matches['version'][0];
    }
    
    // check if we have a number
    if ($version==null || $version=="") {$version="?";}
    
    return array(
        'userAgent' => $u_agent,
        'name'      => $bname,
        'version'   => $version,
        'platform'  => $platform,
        'pattern'    => $pattern
    );
} 



/**
 * Wird aufgerufen, wenn Script beendet wird
 */
function myExit() {
  if (isset($GLOBALS['db'])) {
    $GLOBALS['db']->disconnect();
    unset($GLOBALS['db']);
  }
}
register_shutdown_function('myExit');
?>
