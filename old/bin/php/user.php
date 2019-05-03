<?php

function login() {
  $token = $_POST['token'];
  if(strlen($token) == 40) {//test the length of the token; it should be 40 characters
    $post_data = array('token'  => $token,
                       'apiKey' => $GLOBALS['janrainkey'],
                       'format' => 'json',
                       'extended' => 'true'); //Extended is not available to Basic.

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_URL, 'https://rpxnow.com/api/v2/auth_info');
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_FAILONERROR, true);
    $result = curl_exec($curl);
    if ($result == false){
      echo "\n".'Curl error: ' . curl_error($curl);
      echo "\n".'HTTP code: ' . curl_errno($curl);
      echo "\n"; var_dump($post_data);
    }
    curl_close($curl);

    
    $auth_info = json_decode($result, true);
    //print '<pre>'.print_r($auth_info,1).'</pre>';

    if ($auth_info['stat'] == 'ok') {
      $id = userExist($auth_info['profile']['identifier']);
      
      if ($id && userActive($id)) {
        session_create($id);
        $_SESSION['logged'] = true;
        $_SESSION['username'] = $auth_info['profile']['name']['formatted'];
      }
      else if (!$id) {
        createUser($auth_info);
        print 'User does not exist; User Created; Wating to get authorized';
      }
      else {
        print 'User not active; awaiting authorization';
      }

      } else {
        // Gracefully handle auth_info error.  Hook this into your native error handling system.
        print "\n".'An error occured: ' . $auth_info['err']['msg']."\n";
      }
  }else{
    // Gracefully handle the missing or malformed token.  Hook this into your native error handling system.
    echo 'Authentication canceled.';
  }
}

function userExist($identifier) {
  global $db;
  $db = new DB_MySQL('user');
  $db->query("SELECT id FROM user WHERE identifier = '".mysql_real_escape_string($identifier)."'");
  while($r = $db->fetchRow()) {
    return $r['id'];
  }
  return false;
}

function userActive($id) {
  global $db;
  $db = new DB_MySQL('user');
  $db->query("SELECT active FROM user WHERE id = ".$id);
  while($r = $db->fetchRow()) {
    return $r['active'];
  }
}

function createUser($a) {
  global $db;
  $i = array();
  $db = new DB_MySQL('user');
  $i[] = "'".mysql_real_escape_string($a['profile']['identifier'])."'";
  $i[] = "'".mysql_real_escape_string($a['profile']['email'])."'";
  $i[] = "'".mysql_real_escape_string($a['profile']['name']['formatted'])."'";
  $i[] = "'0'";
  $i[] = (string) time();
  $i[] = 0;
  $db->query("INSERT INTO user (identifier,email,name,role,created,active) VALUES(".implode(',',$i).")");
}

function session_create($uid){
  global $db;
  $db = new DB_MySQL('user');
  $sid = md5(substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$') , 0 , 10));
  $expires = time()+60*60*24*7;
  $db->query('DELETE FROM sessions WHERE uid = '.$uid);
  $db->query("INSERT INTO sessions (uid, sid, expires) VALUES ($uid, '$sid',".$expires.")"); 
  setcookie('uid',$uid     ,$expires,'/');
  setcookie('sid',md5($sid),$expires,'/');
  return true;  
}

function session_active() {
  global $db;
  if (!isset($_COOKIE['uid'])) return false;
  $db = new DB_MySQL('user');
  $db->query("SELECT * FROM sessions WHERE uid = ".$_COOKIE['uid']);
  while ($r = $db->fetchRow()) {
    if ($_COOKIE['sid'] !== md5($r['sid']) || time() > $r['expires']) return false;
    else return true;
  }
  return false;  
}

function logout() {
  $_SESSION['logged'] = false;
  setcookie('sid', '', 0, '/');
}

?>