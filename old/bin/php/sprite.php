<?php

header("Content-Type: image/png");

$w = 20; $h = 20;
$imagefolder = './';

$files = file_list('./', '.png');

$hh = $h * count($files);
$im = imagecreatetruecolor($w, $hh);
imagesavealpha($im, true);
imageAlphaBlending($im, false);
imagefilledrectangle($im, 0, 0, $w-1, $hh-1, imageColorAllocateAlpha($im, 0, 0, 0, 127));
imageAlphaBlending($im, true);
foreach($files as $k=>$f) {
  imagecopy(
          $im, imagecreatefrompng($f),
          0,   $h*$k,
          0,   0,
          $w,  $h);
}
imagepng($im);
imagedestroy($im);
    
  
  function file_list($d, $x){ 
    foreach(array_diff(scandir($d), array('.', '..')) as $f) if (is_file($d . '/' . $f) && (($x) ? ereg($x . '$' , $f) : 1)) $l[] = $f;
    return $l; 
  }
  
?>
