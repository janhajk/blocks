/*global $*/
/*global Block*/
(function() {

      const summernoteProps = {
            toolbar: [
                  ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
                  ['color', ['color']],
                  ['para', ['ul', 'ol', 'paragraph']],
                  ['table', ['table']],
                  ['insert', ['link', 'picture']]
            ]
      };


      /**
       * Creates a block panel
       * 
       * Type: Object
       * 
       * @param string title the title of the panel
       * 
       */
      Block.fn.blockPanel = function(block) {



            const menuPoints = [
                  /**
                   * 
                   * Block edit content
                   */
                  {
                        title: 'Bearbeiten',
                        icon: 'pencil',
                        action: function() {
                              let panel = block.dom.panel;
                              $(block.dom.body).summernote(summernoteProps);
                              let buttonSave = document.createElement('button');
                              buttonSave.className = 'btn btn-primary';
                              buttonSave.setAttribute('type', 'button');
                              buttonSave.innerHTML = 'Speichern';
                              buttonSave.onclick = function() {
                                    panel.removeChild(buttonSave);
                                    panel.removeChild(buttonCancel);
                                    $(block.dom.body).summernote('destroy');
                                    block.content = block.dom.body.innerHTML;
                                    block.saveContent(function() {

                                    });
                              };
                              panel.appendChild(buttonSave);
                              let buttonCancel = document.createElement('button');
                              buttonCancel.className = 'btn btn-primary';
                              buttonCancel.setAttribute('type', 'button');
                              buttonCancel.innerHTML = 'Abbrechen';
                              buttonCancel.onclick = function() {
                                    panel.removeChild(buttonSave);
                                    panel.removeChild(buttonCancel);
                                    $(block.dom.body).summernote('destroy');
                              };
                              panel.appendChild(buttonCancel);

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
                              window.b = new Block(block._id);
                              window.currentBlockId = block._id;
                              window.b.load(function() {
                                    window.b.output(window.b, function() {
                                          console.log('success, fallowing your block:');
                                    });
                              });
                        }
                  },
                  /**
                   * 
                   * load parent block and make main
                   * 
                   * 
                   */
                  {
                        title: 'Übergeordneten Block öffnen',
                        icon: 'fullscreen',
                        action: function() {
                              if (block.data.parent !== '') {
                                    window.b = new Block(block.data.parent);
                                    window.currentBlockId = block.data.parent;
                                    window.b.load(function() {
                                          window.b.output(window.b, function() {
                                                console.log('success!');
                                          });
                                    });
                              }
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
                              block.blockSelector(function(type, ancestor) {
                                    let props = {
                                          parent: block._id,
                                          content_type: type
                                    };
                                    if (ancestor !== undefined) {
                                          props.ancestor = ancestor;
                                    }
                                    if (type === 'clone') {
                                          props.type = 'clone';
                                    }
                                    new Block(props, function(newBlock) {
                                          block.append(newBlock, function() {
                                                newBlock;
                                          });
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
            let panelHead = function() {
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
                  for (let i in menuPoints) {
                        let a = document.createElement('a');
                        a.className = 'dropdown-item';
                        let icon = document.createElement('i');
                        icon.className = 'ti-' + menuPoints[i].icon;
                        a.appendChild(icon);
                        a.innerHTML += menuPoints[i].title;
                        a.onclick = menuPoints[i].action;
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
                  div.style.background = block.isClone?'#FFFFCC':'white';

                  // Body div with content in innerHTML
                  let divBody = document.createElement('div');
                  divBody.className = 'ibox-body';
                  divBody.style.padding = '5px 30px 5px';
                  divBody.style.paddingLeft = (block.level * 20 + 30) + 'px';
                  
                  // Make none selectable
                  divBody.style.webkitUserSelect = 'none';
                  divBody.style.mozUserSelect = 'none';
                  divBody.style.msUserSelect = 'none';
                  divBody.style.userSelect = 'none';
                  
                  // Oben block properties when clicking
                  divBody.onclick = function() {
                        block.details(function(firstTab) {
                              $(firstTab).tab('show');
                              $('.quick-sidebar').backdrop();
                        });


                  };

                  div.appendChild(panelHead);
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

      /**
       * Goes through a block and all of it's children and returns the block that matches the id
       * 
       */
      var findBlockById = function _findBlockById(id, block) {
            if (block._id === id) {
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
