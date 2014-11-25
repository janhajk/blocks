<?php

/**
 * MYSQL Connector Class 
 */
class DB_MySQL {
  private $connection = NULL;
  private $result = NULL;
  
 
  public function __construct($database=NULL){
    $this->database = $database;
    switch ($database) {
      case 'user': 
        $database = $GLOBALS['user_table']; 
        $this->password = $GLOBALS['user_password'];
        $this->username = $GLOBALS['user_user'];
        break;
      default:
        $database = $GLOBALS['default_table'];
        $this->password = $GLOBALS['mysql_password'];
        $this->username = $GLOBALS['mysql_user'];
    }
    $this->database = $database;
    $this->connect($this->database,$this->username,$this->password);
  }
  
  public function __desctruct() {
    $this->disconnect();
  }
  
  private function connect($database,$username,$password) {
    $this->connection = mysql_connect('localhost',$username,$password,TRUE);
    mysql_select_db($database, $this->connection);
    mysql_query('set character set utf8;');
  }
  
  public function switchDb($database,$username,$password) {
    $this->disconnect();
    $this->connect($database,$username,$password);
  }
  
  public function reset() {
    $this->disconnect();
    $this->connect($this->database,$this->username,$this->password);
  }
 
  public function disconnect() {
    if (is_resource($this->connection))				
        mysql_close($this->connection);
  }
 
  public function query($query) {
  	$this->result=mysql_query($query,$this->connection);
    return $this;
  }
 
  public function fetchRow() {
    if ($this->result) {
      return mysql_fetch_assoc($this->result);
    }
    return false;
  }
  
  public function fetchFirst() {
    $r = mysql_fetch_assoc($this->result);
    if ($r) {
      $r = array_shift($r);
      return $r;
    }
    else return $r;
  }
  
  
  public function select($data) {
    $TABLE      = $data['table'];
    $fields     = $data['fields'];
    $conditions = $data['conditions'];
    $order      = $data['order'];
    $LIMIT      = $data['limit'];
    foreach ($conditions as $key=>$value) {
      $conditions[$key] = $key."=".$value;
    }  
    
    $ORDER = !$order ? '' : 'ORDER BY '.$order[0].' '.$order[1];
    
    $sql = 'SELECT '.implode(',', $fields).' FROM ' . $TABLE . ' WHERE '.implode(' AND ', $conditions) .' '. $ORDER . ' LIMIT '.$LIMIT[0].','.$LIMIT[1];
    $this->query($sql);
    return mysql_fetch_assoc($this->result);
  }  
  
  public function selectSingleValue($table, $field, $conditions, $order=false) {
    $r = $this->select(array(
        'table'      => $table,
        'fields'     => array($field),
        'conditions' => $conditions,
        'order'      => $order,
        'limit'      => array(0,1),
    ));
    if ($r) {
      $r = array_shift($r);
      return $r;
    }
    else return $r;
  }
  
  public function insert($table, $data) {
     $sql  = "INSERT INTO ".$table." (".implode(",", array_keys($data)).")".
                  " VALUES (".implode(",", $this->setParams($data)).") ";
     $this->query($sql);
     return mysql_insert_id();    
  }
  
  public function update($table, $data) {
    $data = $this->setParams($data);
    foreach ($data as $key=>$value) {
      $data[$key] = $key." = ".$value;
    }
    $where = array_shift($data);
    $sql = "UPDATE ".$table." SET ".implode(",",$data)." WHERE ".$where;
    $this->query($sql);
    return true;
  }
  
  public function fetchSingleFirst() {
    $r = mysql_fetch_assoc($this->result);
    if ($r) {
      return array_shift($r);
    }
    else return false;
  } 
  
  public function fetchAll() {
    $all = array();
    while ($r = $this->fetchRow()) {
      $all[] = $r;
    }
    return $all;
  }
  
  public function num() {
    return mysql_num_rows($this->result);
  }
  public function affect() {
    return mysql_affected_rows ($this->connection);
  }
  
  private function setParams($data)    {
    if($data != null) {
        $data = array_map(function($n) {
          if(is_int($n))    return (int)  $n;
          if(is_float($n))  return (float)$n;
          if(is_string($n)) return "'".mysql_real_escape_string($n)."'";
          return mysql_real_escape_string($n);
        }, $data);
    }
    return $data;
  }
}
?>