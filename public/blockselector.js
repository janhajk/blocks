/*global Block*/
/*global $*/
(function() {


      let blockTypes = [
            { name: 'html_simple', label: 'Text', icon: 'ti-paragraph' },
            { name: 'heading', label: 'Kapitel', icon: 'ti-text' },
            { name: 'document', label: 'Dokument', icon: 'ti-file' }
      ];


      Block.fn.blockSelector = function(next) {
            let dialog;
            let container = document.createElement('div');
            let box = document.createElement('div');
            let label = document.createElement('label');
            let input = document.createElement('input');
            let scrollBox = document.createElement('div');
            let ul = document.createElement('ul');
            scrollBox.appendChild(ul);
            box.appendChild(label);
            box.appendChild(input);
            box.appendChild(scrollBox);
            container.appendChild(box);
            container.className = 'ibox ibox-fullheight';
            box.className = 'ibox-body';
            ul.className = 'list-group list-group-divider list-group-full';
            label.style.color = '#72777C';
            label.style.border = '0';
            label.style.clip = 'rect(1px,1px,1px,1px)';
            input.className = 'form-control';
            input.type = 'search';
            input.placeholder = 'Block suchen';
            input.style.fontSize = '13px';
            input.style.display = 'block';
            input.style.margin = '16px';
            input.style.padding = '11px 16px';
            input.style.position = 'relative';
            input.style.borderRadius = '4px';
            ul.style.listStyle = 'none';
            ul.style.display = 'flex';
            ul.style.flexWrap = 'wrap';
            ul.style.overflow = 'hidden';
            ul.style.padding = '2px 0';
            for (let i = 0; i < blockTypes.length; i++) {
                  let li = document.createElement('li');
                  let button = document.createElement('button');
                  let iconSpan = document.createElement('span');
                  let titleSpan = document.createElement('span');
                  let icon = document.createElement('i');
                  let name = document.createTextNode(blockTypes[i].label);
                  button.appendChild(iconSpan);
                  button.appendChild(titleSpan);
                  li.appendChild(button);
                  iconSpan.appendChild(icon);
                  iconSpan.appendChild(name);
                  li.className = 'list-group-item flexbox';
                  iconSpan.className = 'flexbox';
                  icon.className = blockTypes[i].icon;
                  titleSpan.innerHTML = blockTypes[i].label;
                  ul.appendChild(li);
                  button.onclick = function() {
                        dialog.dialog('close');
                        return next(blockTypes[i].name);
                  };
                  button.style.display = 'flex';
                  button.style.width = '100%';
                  button.style.fontSize = '13px';
                  button.style.justifyContent = 'center';
                  button.style.cursor = 'pointer';
                  button.style.color = '#32373c';
                  button.style.alignItems = 'stretch';
                  button.style.flexDirection = 'column';
            }

            document.getElementsByTagName('body')[0].appendChild(container);

            dialog = $(container).dialog({
                  autoOpen: true,
                  height: 400,
                  width: 400,
                  modal: true
            });

      };

}());
