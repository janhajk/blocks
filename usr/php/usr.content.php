<?php

function content_usr() {  
  global $db; 
  $db = new DB_MySQL();
  
  $action  = preg_replace('|[^a-z]|','',$_POST['action']);  // Actions müssen aus kleinen Buchstaben bestehen    
  $typ     = $_POST['type']==1?1:0; // content oder chapter
  $id      = (int) preg_replace('|[^0-9]|','',$_POST['id']);
  $id2     = isset($_POST['id2']) ? (int) preg_replace('|[^0-9]|','',$_POST['id2']) : false;
  $content = $_POST['content'];
  $date    = isset($_POST['date']) && validDate($_POST['date']) ? $_POST['date'] : false;
  
  if ($action === 'load') {
    print json_encode(array(
        'content'  => getFlat()
    ));
  }
  elseif ($action === 'add') {
    print json_encode(blockAdd($id, 0, $typ, $content, ''));  // returns $bid
  } 
  elseif ($action === 'update') {
    print json_encode(blockUpdate($id,$content));
  }
  elseif ($action === 'toggleactive') {
    if ($id != 0) {
      blockToggleActive($id);
    }
    print json_encode(true);
  }
  elseif ($action === 'trash') {
    if ($id != 0) {
      blockTrash($id);
    }
    print json_encode(true);
  }
  elseif ($action === 'recycle') {
    if ($id != 0) {
      blockRecycle($id);
    }
    print json_encode(true);
  }
  elseif ($action === 'date' && $date!==false) {
    updateDate($id, $date);
    print json_encode(true);
  }
  elseif ($action === 'parent' && $id) {
    updateParent($id, $id2);
    print json_encode(true);
  }
  elseif ($action === 'weight') {
    print json_encode(updateWeight($content));
  }
  elseif ($action === 'logout') {
    $_SESSION['logged'] = false;
    setcookie('sid', '', 0, '/');
  }
  elseif ($action === 'history') {
    print json_encode(getBlockValueRevisions($id));
  }
}

function getFlat() {
  global $db;
  $out     = array();
  $db->query("SELECT b.*, d.date FROM blocks b LEFT JOIN sub_date d ON (b.bid = d.cid) ORDER BY b.weight ASC");
  $content = $db->fetchAll();
  foreach ($content as $key=>$r) {
    $bid                   = $r['bid'];
    $out[$key]['cid']      = (int) $bid;
    $out[$key]['name']     = $r['name'];
    $out[$key]['date']     = $r['date'] != NULL ? (int) $r['date'] : $r['date'];
    
    $properties            = getBlockProperties($bid);    
    $out[$key]['type']     = (int) $properties['valtype'];
    $out[$key]['active']   = (int) $properties['active'];
    //$out[$key]['weight']   = (int) $properties['wid'];    
    $out[$key]['weight']   = (int) $r['weight'];
    $out[$key]['changed']  = (int) $properties['changed'];
    $out[$key]['children'] = getChildren($bid);
    $out[$key]['parents']  = array(getBlockProperty($bid, 'pid'));
    $out[$key]['content']  = getBlockValue($properties['valid']);
    $out[$key]['trash']    = (int) $properties['trash'];
    $out[$key]['revisions']= array();
  }
  return $out;
}

function blockAdd($pid, $doc, $valtype, $value, $name='') {
  global $db;
  $now = time();
  $bid = $db->insert('blocks', array(
      'name'    => $name,
      'doc'     => $doc,
      'uid'     => 0,
      'created' => $now
  ));
  $valid = addValue($value);
  $vid = $db->insert('blocks_properties', array(
      'bid'     => $bid,
      'pid'     => $pid,
      'tid'     => 0,
      'valtype' => $valtype,
      'valid'   => $valid,
      'changed' => $now,
      'wid'     => -1
  ));
  addBlockChild($pid, $bid);
  // Do plugin actions...
  //
  //
  
  return $bid;
}

function blockUpdate($bid, $value) {
  global $db;
  $valid = addValue($value);
  $vid   = clone_properties($bid, getBlockProperty($bid, 'vid'));
  $db->update('blocks_properties', array(
      'vid'     => $vid,
      'valid'   => $valid,
      'changed' => time()));
  // Do Plugin Actions...
  //
  //  
  return array($vid, $valid);
}

function addValue($value, $language=0) {
  return $GLOBALS['db']->insert('blocks_values', array(
      'language' => $language,
      'value'    => $value
  ));
}

function getBlockProperties($bid) {
  return $GLOBALS['db']->select(array(
    'table'      => 'blocks_properties',
    'fields'     => array('*'),
    'conditions' => array('bid'=>$bid),
    'order'      => array('vid', 'DESC'),
    'limit'      => array(0,1),
  ));
}

function getBlockProperty($bid, $property) {
  return ((int) $GLOBALS['db']->selectSingleValue(
          'blocks_properties',
          $property,
          array('bid'=>$bid),
          array('vid','DESC')
  ));
}

function setBlockProperty($vid, $property, $value) {
  global $db;
  $sql   = "UPDATE blocks_properties SET ".$property." = ".$value." WHERE vid = ".$vid;
  $db->query($sql);
  return true;
}

function getBlockValue($valid) {
  global $db;
  $db->query("SELECT value FROM blocks_values WHERE valid = ".$valid." LIMIT 0,1");
  return stripslashes($db->fetchSingleFirst());
}

function getBlockValueRevisions($bid) {
  global $db;
  $revisions = array();
  $db->query("SELECT valid, changed FROM blocks_properties WHERE bid = ".$bid." ORDER BY changed ASC");
  while ($r = $db->fetchRow()) {
    $revisions[(int) $r['valid']]['changed'] = (int) $r['changed'];
  }
  $db->query("SELECT valid,value FROM blocks_values WHERE valid = ".implode(" OR valid = ", array_keys($revisions))."");
  while ($r = $db->fetchRow()) {
    $revisions[(int) $r['valid']]['value'] = stripslashes($r['value']);
  }
  return $revisions; 
}

function updateWeight($arrWeight) {
  global $db;
  foreach ($arrWeight as $weight=>$c) {
    $c = (int) $c;
    if ($c) {
      $db->update('blocks', array(
          'bid'     => $c,
          'weight'  => $weight));
      // Do Plugin Actions...
      //
      //  
    }
  }
  return true;
}

function getChildren($bid) {
  $out = array(
    0 => array(),
    1 => array());
  $bid = (int) $bid;
  $children = getBlockChildren($bid);
  foreach ($children as $bid) {
    $out[getBlockProperty($bid, 'type')][] = (int) $bid;
  }
  return $out; 
}

function getCurrentVid($bid) {
  return (getBlockProperty($bid, 'vid'));
}

function clone_properties($bid, $vid) {
  global $db;
  $props = $db->select(array(
    'table'      => 'blocks_properties',
    'fields'     => array('*'),
    'conditions' => array('bid'=>$bid, 'vid'=>$vid),
    'order'      => false,
    'limit'      => array(0,1),
  ));
  unset($props['vid']);
  return $db->insert('blocks_properties', $props);
}

function blockMove($bid, $pid) {
  
}

function blockTrash($bid) {
  $vid   = clone_properties($bid, getBlockProperty($bid, 'vid'));
  setBlockProperty($vid, 'trash', 1);
  // Do Plugin Actions...
  //
  //
  return array($vid);
}

function blockRecycle($bid) {
  $vid   = clone_properties($bid, getBlockProperty($bid, 'vid'));
  setBlockProperty($vid, 'trash', 0);
  // Do Plugin Actions...
  //
  //
  return array($vid);
}


/**
 * Switched durchgestrichenen Text
 * @global type $db
 * @param int $bid 
 * @param int $active initial call has value -1, n-th turn use trasvalue from top block
 */
function blockToggleActive($bid, $active=-1) {
  if ($active == -1) {
    $active = getBlockProperty($bid, 'active') ? 0 : 1; // $active is inverted
  }
  $vid   = clone_properties($bid, getBlockProperty($bid, 'vid'));
  setBlockProperty($vid, 'active', $active);
  $bids = getBlockChildren($bid);
  foreach ($bids as $bid) {
    blockToggleActive($bid, $active);
  }
}

/**
 * Aktualisiert den Parent eines Eintrages
 * @param type $id die ID des Eintrages
 * @param type $cid die neue Parent ID
 */
function updateBlockParent($bid, $pid) {
  $pid = (int) $pid;
  $vid = clone_properties((int) $bid, getCurrentVid($bid));
  $GLOBALS['db']->update('blocks_properties', array('pid'=>$pid, 'vid'=>$vid));
}

function getBlockChildren($bid) {
  global $db;
  $vid      = getCurrentVid($bid);
  $cid      = $db->selectSingleValue('blocks_properties', 'cid'     , array('vid' => $vid));
  $children = $db->selectSingleValue('blocks_children'  , 'children', array('cid' => $cid));
  return json_decode(!$children?array():$children);
}

function removeBlockChild($bid, $childId) {
  global $db;
  $children = array_diff(getBlockChildren($bid), array($childId));
  $cid = $db->insert('blocks_children', array('children' => json_encode($children)));
  $vid = getCurrentVid($bid);
  $vid = clone_properties($bid,$vid);
  $db->update('blocks_properties', array(
      'vid' => $vid,
      'cid' => $cid
  ));
}

function addBlockChild($bid, $childId) {
  global $db;
  $children = array_merge(getBlockChildren($bid), array($childId));
  $cid = $db->insert('blocks_children', array('children' => json_encode($children)));
  $vid = getCurrentVid($bid);
  $vid = clone_properties($bid,$vid);
  $db->update("blocks_properties", array(
      'vid' => $vid,
      'cid' => $cid
  ));
}

include_once('usr.content.old.php');

?>