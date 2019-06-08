/*global Block*/
/*global $*/
(function() {

      let div;
      let searchBlocks = [];


      let blockTypes = [
            { name: 'html_simple', label: 'Text', icon: 'ti-paragraph' },
            { name: 'heading', label: 'Kapitel', icon: 'ti-text' },
            { name: 'document', label: 'Dokument', icon: 'ti-file' }
      ];

      let backdropHide = function(next) {
            $('body').removeClass('has-backdrop');
            $('.shined').removeClass('shined');
            try {
                  document.getElementsByTagName('body')[0].removeChild(div);
            }
            catch (e) {
                  // if div doesn't exist anymore
            }
            finally {
                  return next();
            }
      };


      /**
       * 
       * Loads list of available blocks to user
       * needs tags, names and _ids
       * 
       * 
       */
      let loadMyBlocks = function(next) {
            var request = new XMLHttpRequest();
            request.open('GET', '/block/byNameAndTag', true);
            request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
            request.onload = function() {
                  if (request.status >= 200 && request.status < 405) {
                        try {
                              let newBlock = JSON.parse(request.responseText);
                              console.log(newBlock);
                              return next(null, newBlock);
                        }
                        catch (e) {
                              console.log(e);
                              return next(e);
                        }
                  }
                  else {
                        console.log('Error in request; status was: ' + request.status);
                        return next(true);
                  }
            };
            request.onerror = function() {
                  console.log('There was an error in xmlHttpRequest!');
                  return next(true);
            };
            request.send();
      };


      Block.fn.blockSelector = function(next) {


            let header = {
                  title: 'Block hinzufügen'
            };


            // content
            div = document.createElement('div');
            div.className = ['dropdown-menu', 'dropdown-menu-right', 'dropdown-menu-media'].join(' ');
            div.style.zIndex = 99999999;
            div.style.margin = '0 auto';
            div.style.width = '30em';
            div.style.height = '30em';
            div.style.display = 'block';
            div.style.position = 'fixed';
            div.style.top = '50%';
            div.style.left = '50%';
            div.style.marginTop = '-15em';
            div.style.marginLeft = '-15em';


            // Header
            let header_div = document.createElement('div');
            header_div.className = ['dropdown-header', 'text-center'].join(' ');
            let header_div_div = document.createElement('div');
            let header_span = document.createElement('span');
            header_span.className = 'font-18';
            header_span.innerHTML = header.title;
            header_div_div.appendChild(header_span);
            header_div.appendChild(header_div_div);
            div.appendChild(header_div);

            // Search Form
            let searchContainer = document.createElement('div');
            let searchInput = document.createElement('input');
            searchInput.type = 'search';
            searchInput.className = 'form-control';
            searchInput.placeholder = 'Suche nach Blocktyp oder Blockname';
            searchInput.autocomplete = 'false';
            searchContainer.appendChild(searchInput);
            div.appendChild(searchContainer);

            // content
            let content_div = document.createElement('div');
            content_div.className = 'p-3';
            div.appendChild(content_div);

            // Item List
            let ul = document.createElement('ul');
            ul.className = ['timeline', 'scroller'].join(' ');
            ul.setAttribute('data-height', '320px');
            content_div.appendChild(ul);

            // Items
            for (let i = 0; i < blockTypes.length; i++) {
                  let li = document.createElement('li');
                  let button = document.createElement('button');
                  let iconSpan = document.createElement('span');
                  let icon = document.createElement('i');
                  let name = document.createTextNode(blockTypes[i].label);
                  button.appendChild(iconSpan);
                  li.appendChild(button);
                  iconSpan.appendChild(icon);
                  iconSpan.appendChild(name);
                  li.className = 'list-group-item flexbox';
                  iconSpan.className = 'flexbox';
                  icon.className = blockTypes[i].icon;
                  icon.style.marginRight = '10px';
                  ul.appendChild(li);
                  button.onclick = function() {
                        backdropHide(function() {
                              return next(blockTypes[i].name);
                        });
                  };
                  li.style.float = 'left';
                  button.style.display = 'flex';
                  button.style.width = '100%';
                  button.style.fontSize = '13px';
                  button.style.justifyContent = 'center';
                  button.style.cursor = 'pointer';
                  button.style.color = '#32373c';
                  button.style.alignItems = 'stretch';
                  button.style.flexDirection = 'column';
                  button.style.background = 'transparent';
                  button.style.border = 'transparent';
            }

            document.getElementsByTagName('body')[0].appendChild(div);
            $(div).backdrop();
            $('.backdrop').click(backdropHide);


      };

}());
