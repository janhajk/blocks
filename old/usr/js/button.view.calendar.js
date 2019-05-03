var buttonCalendar = function(type,title,target) {  
  buttonCalendar.parent.init.call(this,type,title,target);
};
buttonCalendar.prototype             = new oButton();
buttonCalendar.prototype.constructor = oButton;
buttonCalendar.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonCalendar.prototype.click = function() {
  l.view = 'calendar';
  l.display();
};


liste.prototype.loadCalendar = function(){
  $('#middle').empty();
  this.createCol(0);
  $('#level0').enableSelection();
  $('#level0').css({'width':'100%'});
  $('#level0-content').append(this.loadCalendarGrid(3));
  $('#scontent-cheader-0').html('Kalender Ansicht');
  $('body').css('overflow','hidden');
};


liste.prototype.loadCalendarGrid = function(totWeeks) {
  /**
   * Gibt den aktuellen Tag der Woche aus
   * Montag (0) bis Sonntag (6)
   */
  var curWeekDay = function() {
    var wd = (new Date()).getDay();
    return wd===0?6:wd-1;
  },
  
  getFrom = function() {
    return (new Date()).getTime() - curWeekDay()*86400000 - 86400000*7;
  },
  
  isToday = function(d) {
    var today = new Date();
    return (d.getDate() === today.getDate() && d.getMonth() === today.getMonth()) ? true : false;
  },
  
  styleDay = [
      'float                   : left',
      'width                   : 14%',
      'height                  : 200px',
      'border-width            : 1px',
      'border-color            : #CCC',
      'border-style            : solid',
      'border-left             : none',
      'border-bottom           : none',
      'background              : white',
      'padding                 : 0',
      'margin                  : 0'
    ].join(';').replace(/ /g, ''),
  
  styleMenu =  [
      'text-align              : center',
      'margin                  : 0',
      'padding                 : 0',
      'height                  : 20px',
      'border-width            : 1px',
      'border-color            : black',
      'border-style            : solid',
      'border-top-left-radius  : 6px',
      'border-top-right-radius : 6px'
    ].join(';').replace(/ /g, ''),
    
  styleContent =  [
      'margin                  : 0',
      'padding                 : 0',
      'height                  : 180px',
      'overflow-y              : auto'
    ].join(';').replace(/ /g, ''),
  
  i=0, s=0, menu='', content='', html='', from=getFrom(), tag, cids, p;
  
  for (i;i<totWeeks;i++) {
    html += '<div style="'+styleDay+';width:1.5%">'+(new Date((i*7)*86400000+from)).getWeek()+'</div>';
    for (s=0;s<7;s++) {
      content = '';
      tag = new Date((i*7+s)*86400000+from);
      cids = this.data.getDaysItems(tag);
      for (p in cids) {
        content += this.item(cids[p], this.data.data[cids[p]].content.replace(/<(?:.|\n)*?>/gm, '').substr(0,100), 'chapter');
      }
      menu = '<div style="'+styleMenu+'">'+tag.getDate()+'.'+(tag.getMonth()+1)+'</div>';
      content = '<div style="'+styleContent+'">'+content+'</div>';
      html += '<div class="list1" style="'+styleDay+';background:'+(isToday(tag)?'#54DB4D':'')+';">'+menu+content+'</div>';
    }
    html += '<div style="clear:both"></div>';
  }
  return '<div style="border-bottom:1px solid #CCC;border-left:1px solid #CCC;">'+html+'</div>';
};


/**
 * Extends: data
 * Gibt alle Einträge für ein spezifisches Datum zurück
 * @param 
 */
data.prototype.getDaysItems = function(date) {
  var cids = [], i, d=date.getDate(),m=date.getMonth(),y=date.getYear(),dd,mm,yy, cDate;
  for (i in this.data) {
    if (this.data[i].date === null) {continue;}
    cDate = new Date(this.data[i].date*1000);
    dd = cDate.getDate();
    mm = cDate.getMonth();
    yy = cDate.getYear();
    if (dd === d && mm === m && yy === y) {
      cids.push(this.data[i].cid);
    }
  }
  return cids;
};