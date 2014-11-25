/**
 * erstellt die Menu-Buttons
 */
htmlConstruct.prototype.createMenu = function() {
  if (this.browser === 'mobile') {
    new button('home'   , 'Home'                                , 'header');
    new button('urgent' , 'Inhalte nach Dringlichkeit anzeigen' , 'header');
    new button('bug'    , 'Bugs anzeigen'                       , 'header');
    new button('add'    , 'Inhalt hinzuf&uuml;gen'              , 'header');
    new button('completed', 'Erledigt / Durchstreichen [space]' , 'header');
    new searchfield('header');

  }
  else {
    new button('home'   , 'Home'                                , 'header');
    new button('urgent' , 'Inhalte nach Dringlichkeit anzeigen' , 'header');
    new button('bug'    , 'Bugs anzeigen'                       , 'header');
    new button('calendar', 'Kalender Ansicht'                   , 'header');
    new button('linethrough', 'Erledigte anzeigen'              , 'header');
    new button('treegraph', 'Inhalte als Tree rendern'          , 'header');
    new button('history', 'Historie anzeigen'                   , 'header');
    new button('spacer' , ''                                    , 'header');
    new button('add'    , 'Inhalt hinzuf&uuml;gen'              , 'header');
    new button('edit'   , 'Inhalt bearbeiten'                   , 'header');
    new button('completed', 'Erledigt / Durchstreichen'         , 'header');
    new button('trash'  , 'Inhalt in den Papierkorb verschieben', 'header');  
    new button('recycle', 'Inhalt aus dem Papierkorb holen'     , 'header');  
    new button('spacer' , ''                                    , 'header');
    new button('date'   , 'Datum hinzuf&uuml;gen'               , 'header');
    new button('tags'   , 'Tags anpassen'                       , 'header');  
    new button('parent' , 'Besitzer &auml;ndern'                , 'header');
    new button('spacer' , ''                                    , 'header');
    new button('print'  , 'ausgew&auml;hltes Kapitel Drucken'   , 'header');
    new button('spacer' , ''                                    , 'header');
    new button('update' , 'gesamten Inhalt neu laden'           , 'header');
    new button('backup' , 'Backup der Datenbank erstellen'      , 'header');

    //this.button('link'   , 'Eintrag neu Verlinken');
    new searchfield('header');
    $('#header').append('<div id="adressbar"  class="btn btnNoImage" title="Adresse"><span></span></div>'); // Adresszeile in #Header
  }  
};