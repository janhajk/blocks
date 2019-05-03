<?php

abstract class Observer {
  public function __construct($subject = null) {
    if (is_object($subject) && $subject instanceof Subject) {
      $subject->attach($this);
    }
  }

  public function update($subject) {
    // looks for an observer method with the state name
    if (method_exists($this, $subject->getState())) {
      call_user_func_array(array($this, $subject->getState()), array($subject));
    }
  }
}

abstract class Subject {
  protected $observers;
  protected $state;

  public function __construct() {
    $this->observers = array();
    $this->state = null;
  }

  public function attach(Observer $observer) {
    $i = array_search($observer, $this->observers);
    if ($i === false) {
      $this->observers[] = $observer;
    }
  }

  public function detach(Observer $observer) {
    if (!empty($this->observers)) {
      $i = array_search($observer, $this->observers);
      if ($i !== false) {
        unset($this->observers[$i]);
      }
    }
  }

  public function getState() {
    return $this->state;
  }

  public function setState($state) {
    $this->state = $state;
    $this->notify();
  }

  public function notify() {
    if (!empty($this->observers)) {
      foreach ($this->observers as $observer) {
        $observer->update($this);
      }
    }
  }

  public function getObservers() {
    return $this->observers;
  }
}

?>
