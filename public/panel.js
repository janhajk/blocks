/*global $*/
/*global Block*/
(function() {


      /**
       * Creates a block panel
       * 
       * Type: Object
       * 
       * @param string title the title of the panel
       * 
       */
      Block.fn.blockPanel = function(block) {
            let summernoteProps = {
                  toolbar: [
                        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture']]
                  ]
            };


            this.menuPoints = [
                  /**
                   * 
                   * Block edit content
                   */
                  {
                        title: 'Bearbeiten',
                        icon: 'pencil',
                        action: function() {
                              $(block.dom.body).summernote(summernoteProps);
                              let buttonSave = document.createElement('button');
                              buttonSave.className = 'btn btn-primary';
                              buttonSave.setAttribute('type', 'button');
                              buttonSave.innerHTML = 'Speichern';
                              buttonSave.onclick = function() {
                                    block.dom.panel.removeChild(buttonSave);
                                    block.dom.panel.removeChild(buttonCancel);
                                    $(block.dom.body).summernote('destroy');
                                    block.content = block.dom.body.innerHTML;
                                    block.saveContent(function() {

                                    });
                              };
                              block.dom.panel.appendChild(buttonSave);
                              let buttonCancel = document.createElement('button');
                              buttonCancel.className = 'btn btn-primary';
                              buttonCancel.setAttribute('type', 'button');
                              buttonCancel.innerHTML = 'Abbrechen';
                              buttonCancel.onclick = function() {
                                    block.dom.panel.removeChild(buttonSave);
                                    block.dom.panel.removeChild(buttonCancel);
                                    $(block.dom.body).summernote('destroy');
                              };
                              block.dom.panel.appendChild(buttonCancel);
                        }
                  },
                  /**
                   * Open Block
                   * 
                   */
                  {
                        title: 'Block öffnen',
                        icon: 'fullscreen',
                        action: function() {
                              window.b = new Block(block._id, block.contentDom);
                              window.currentBlockId = block._id;
                              window.b.load(function() {
                                    console.log('success, fallowing your block:');
                              });
                        }
                  },
                  // { title: 'neuen Block darüber', icon: 'angle-double-up' },
                  /**
                   * 
                   * Append new Block
                   * 
                   */
                  {
                        title: 'neuen Sub-Block anhängen',
                        icon: 'angle-double-down',
                        action: function() {
                              new Block({ parent: block._id }, block.dom.row, function(newBlock) {
                                    block.append(newBlock, function() {

                                    });
                              });
                        }
                  },
                  // { title: 'Block unterordnen', icon: 'angle-double-right' },
                  { title: 'Block nach oben', icon: 'arrow-up' },
                  { title: 'Block nach unten', icon: 'arrow-down' },
                  /**
                   * 
                   * Delete/Remove block completely
                   * 
                   * 
                   */
                  {
                        title: 'Block löschen',
                        icon: 'trash',
                        action: function() {
                              block.remove(function() {
                                    let parentBlock = findBlockById(block.data.parent, window.b);
                                    for (let i in parentBlock.data.children) {
                                          if (parentBlock.data.children[i].data._id === block.data._id) {
                                                parentBlock.data.children.splice(i, 1);
                                                break;
                                          }
                                    }
                                    block.contentDom.removeChild(block.dom.row);
                              });
                        }
                  }
            ];


            /**
             * Head with dropdown menu
             * 
             */
            this.panelHead = function() {
                  // Head div container
                  let head = document.createElement('div');
                  head.className = 'ibox-head';
                  head.style.float = 'right';
                  head.style.minHeight = '0';

                  // Tools menu container
                  let tools = document.createElement('div');
                  tools.className = 'ibox-tools';
                  tools.style.marginRight = '10px';
                  tools.style.right = '0px';
                  tools.style.top = '0px';
                  tools.style.marginTop = '10px';
                  tools.style.borderBottom = 'none';
                  head.appendChild(tools);

                  // Menu Button (3 dots)
                  let menuButton = document.createElement('a');
                  menuButton.className = 'dropdown-toggle';
                  let icon = document.createElement('i');
                  icon.className = 'ti-more-alt';
                  menuButton.appendChild(icon);
                  menuButton.setAttribute('data-toggle', 'dropdown');
                  tools.appendChild(menuButton);

                  // Bootstrap Dropdown Menu
                  let menu = document.createElement('div');
                  menu.className = 'dropdown-menu dropdown-menu-right';
                  // read items
                  for (let i in this.items) {
                        let a = document.createElement('a');
                        a.className = 'dropdown-item';
                        let icon = document.createElement('i');
                        icon.className = 'ti-' + this.items[i].icon;
                        a.appendChild(icon);
                        a.innerHTML += this.items[i].title;
                        a.onclick = this.items[i].action;
                        menu.appendChild(a);
                  }
                  tools.appendChild(menu);

                  return head;
            }();



            this.content = function() {
                  // div Container
                  let div = document.createElement('div');
                  div.className = 'ibox ibox-fullheight';
                  div.style.height = 'calc(100% - 5px)';
                  div.style.marginBottom = '5px';

                  // Body div with content in innerHTML
                  let divBody = document.createElement('div');
                  divBody.className = 'ibox-body';
                  divBody.style.padding = '5px 30px 5px';
                  divBody.style.paddingLeft = (block.level * 20 + 30) + 'px';
                  divBody.style.webkitUserSelect = 'none';
                  divBody.style.mozUserSelect = 'none';
                  divBody.style.msUserSelect = 'none';
                  divBody.style.userSelect = 'none';

                  // Deprecated: if div has maximum height, this makes it scrollable
                  // let divSlimScroll = document.createElement('div');
                  // divSlimScroll.className = 'slimScrollDiv';
                  // divSlimScroll.style.position = 'relative';
                  // divSlimScroll.style.overflow = 'hidden';
                  // divSlimScroll.style.width = 'auto';
                  // divSlimScroll.style.height = '470px';
                  // divBody.appendChild(divSlimScroll);

                  div.appendChild(this.panelHead);
                  div.appendChild(divBody);

                  // Panel container as bootstrap grid row
                  let row = document.createElement('div');
                  row.className = 'row';
                  let col = document.createElement('div');
                  col.className = 'col-md-8';
                  row.appendChild(col);
                  col.appendChild(div);
                  return { body: divBody, row: row, panel: div };

            }();

      };


      var findBlockById = function _findBlockById(id, block) {
            if (block.data._id === id) {
                  return block;
            }
            for (let i in block.data.children) {
                  let curBlock = _findBlockById(id, block.data.children[i]);
                  if (curBlock) {
                        return curBlock;
                  }
            }
            return false;
      };

}());
