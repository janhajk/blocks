<?php
function ical() {
  include_once('usr/php/usr.content.php');
  $ical = new ICS('wiki Jan');
  global $db;
  $db = new DB_MySQL('');
  $events = array();
  $db->query("SELECT * FROM sub_date");
  while($r = $db->fetchRow()) {
    $events[] = $r;
  }
  foreach ($events as $event) {
    $event = array_merge($event,getCurrentRevision($event['cid']));
    $ical->addEvent($event['date'], $event['timestamp'], substr(strip_tags($event['content']),0,50)/*, $event['content']*/);
  }
  $ical->render();
}

class ICS {

	protected $calendarName;
	protected $events = array();
	

	/**
	 * Constructor
	 * @param string $calendarName
	 */	
	public function __construct($calendarName=""){
		$this->calendarName = $calendarName;
	}//function


	/**
	 * Add event to calendar
	 * @param string $calendarName
	 */	
	public function addEvent($start, $end, $summary="", $description="", $url=""){
		$this->events[] = array(
			'date'       => $start,
			'created'     => $end,
			'summary'     => $summary,
			'description' => $description,
			'url'         => $url
		);
	}
	
	
	public function render() {		
		$ics = '';
	
		//Add header
		$ics .= "BEGIN:VCALENDAR"."\r\n";
    $ics .= "VERSION:2.0"."\r\n";
    $ics .= "CALSCALE:GREGORIAN"."\r\n";
    $ics .= "METHOD:PUBLISH"."\r\n";
    //METHOD:PUBLISH
    //X-WR-CALNAME:".$this->calendarName."
    $ics .= "PRODID:-//hacksw/handcal//NONSGML v1.0//EN"."\r\n";
    $ics .= "X-WR-CALNAME:Jan Schär wiki"."\r\n";
    $ics .= "X-WR-TIMEZONE:Europe/Zurich"."\r\n";
		
    
		//Add events
		foreach($this->events as $event){
			$ics .= "BEGIN:VEVENT"."\r\n";
      $ics .= "UID:". md5($event['summary']) ."@wiki.janschaer.ch"."\r\n";
      $ics .= "DTSTAMP:" .gmdate('Ymd').'T'. gmdate('His').'Z'."\r\n";
      //$ics .= "DTSTART:" .gmdate('Ymd', $event['start'])."T".gmdate('His', $event['start'])."Z"."\r\n";
      //$ics .= "DTEND:".gmdate('Ymd', $event['end'])."T".gmdate('His', $event['end'])."Z"."\r\n";
      $ics .= "DTSTART;VALUE=DATE:" .gmdate('Ymd', $event['date'])."\r\n";
      $ics .= "DTEND;VALUE=DATE:"   .gmdate('Ymd', $event['date']+60*60*24)  ."\r\n";
      $ics .= "SUMMARY:"            .utf8_encode(str_replace("\n", "\\n", $event['summary']))."\r\n";
      $ics .= "CREATED:"            .gmdate('Ymd', $event['created'])."T".gmdate('His', $event['created'])."Z"."\r\n";
      $ics .= "LAST-MODIFIED:"      .gmdate('Ymd', $event['created'])."T".gmdate('His', $event['created'])."Z"."\r\n";
      $ics .= "DESCRIPTION:"        .str_replace("\n", "\\n", $event['description'])."\r\n";
      $ics .= "END:VEVENT"          ."\r\n";
		}
		
    //Footer
		$ics .= "END:VCALENDAR";


		//Output
		//header('Content-type: text/calendar; charset=utf-8');
		//header('Content-Disposition: inline; filename="wikijan.ics"');
		print $ics;
	}
}

?>