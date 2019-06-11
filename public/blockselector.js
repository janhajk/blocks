/*global Block*/
/*global $*/
(function() {

      let div;
      let searchBlocks = [];
      let cloneList;


      let blockTypes = [
            { name: 'document', label: 'Dokument', icon: 'ti-file' },
            { name: 'heading', label: 'Kapitel', icon: 'ti-text' },
            { name: 'html_simple', label: 'Text', icon: 'ti-paragraph' }
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

      let filterCloneList = function(searchString) {
            while (cloneList.firstChild) {
                  cloneList.removeChild(cloneList.firstChild);
            }
            searchString = searchString.trim().toLowerCase();
            if (searchString.length > 2) {
                  for (let i = 0; i < searchBlocks.length; i++) {
                        if ((searchBlocks[i].name !== undefined && searchBlocks[i].name.toLowerCase().indexOf(searchString) > -1) ||
                              searchBlocks[i].tags.filter(function(item) {
                                    return (typeof item == 'string' && item.toLowerCase().indexOf(searchString) > -1);

                              }).length > 0) {
                              let item = document.createElement('li');
                              item.className = 'timeline-item';
                              let span = document.createElement('span');
                              span.className = 'timeline-point';
                              let link = document.createElement('a');
                              link.href = 'javascript:;';
                              link.innerHTML = searchBlocks[i].name;
                              link.onclick = function() {

                              };
                              item.appendChild(span)
                              item.appendChild(link);
                              cloneList.appendChild(item);
                        }
                  }
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
                              let blocks = JSON.parse(request.responseText);
                              return next(null, blocks);
                        }
                        catch (e) {
                              return console.log(e), next(e);
                        }
                  }
                  else {
                        return console.log('Error in request; status was: ' + request.status);
                  }
            };
            request.onerror = function() {
                  return console.log('There was an error in xmlHttpRequest!');
            };
            request.send();
      };


      Block.fn.blockSelector = function(next) {

            loadMyBlocks(function(e, blocks) {
                  if (e) {}
                  else {
                        searchBlocks = blocks;
                  }
            });


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
            searchContainer.style.margin = 'auto';
            searchContainer.style.width = '90%';
            searchInput.type = 'search';
            searchInput.className = 'form-control';
            searchInput.placeholder = 'Suche nach Blocktyp oder Blockname';
            searchInput.autocomplete = 'false';
            searchInput.placeholder = 'Suche nach Blocktyp oder Blockname';
            searchInput.autocomplete = 'false';
            searchInput.onkeyup = function() {
                  let value = searchInput.value;
                  filterCloneList(value);
            };
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

            // Search Results for clone blocks
            let cloneContainer = document.createElement('div');
            cloneContainer.className = 'ibox-body';
            cloneList = document.createElement('ul');
            cloneList.className = 'timeline scroller';
            cloneContainer.className = 'slimScrollDiv';
            cloneContainer.style.position = 'relative';
            cloneContainer.slimscroll({
                        height: $(this).attr('data-height') || '100%',
                        color: $(this).attr('data-color') || '#71808f',
                        railOpacity: '0.9',
                        size: '4px'
                  });
            cloneContainer.appendChild(cloneList);
            content_div.appendChild(cloneContainer);

            document.getElementsByTagName('body')[0].appendChild(div);
            $(div).backdrop();
            $('.backdrop').click(backdropHide);


      };

}());
