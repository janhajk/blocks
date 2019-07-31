/*global $*/
/*global Block*/
/*global $B */
(function() {

      const summernoteProps = {
            toolbar: [
                  ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
                  ['color', ['color']],
                  ['para', ['ul', 'ol', 'paragraph']],
                  ['table', ['table', 'codeview']],
                  ['insert', ['link', 'picture']]
            ]
      };

      const editAction = function(block) {
            let panel = block.dom.panel;
            let body = block.dom.body;
            body.innerHTML = block.data.content;
            $(body).summernote(summernoteProps);
            $(body).summernote('focus');

            // Button Save
            let buttonSave = document.createElement('button');
            buttonSave.className = 'btn btn-primary';
            buttonSave.setAttribute('type', 'button');
            buttonSave.innerHTML = 'Speichern';
            buttonSave.onclick = function() {
                  panel.removeChild(buttonSave);
                  panel.removeChild(buttonCancel);
                  $(body).summernote('destroy');
                  block.data.content = body.innerHTML;
                  block.saveContent(function() {
                        body.innerHTML = block.formatedContent();
                  });
            };
            panel.appendChild(buttonSave);

            // Button Cancel
            let buttonCancel = document.createElement('button');
            buttonCancel.className = 'btn btn-primary';
            buttonCancel.setAttribute('type', 'button');
            buttonCancel.innerHTML = 'Abbrechen';
            buttonCancel.onclick = function() {
                  panel.removeChild(buttonSave);
                  panel.removeChild(buttonCancel);
                  $(block.dom.body).summernote('destroy');
                  block.dom.body.innerHTML = block.formatedContent();
            };
            panel.appendChild(buttonCancel);
      };

      Block.fn.blockPanelMenu = [];


      let getMenu = function(block) {


            let menuPoints = [
                  /**
                   * 
                   * Block edit content
                   */
                  {
                        title: 'Bearbeiten',
                        icon: 'pencil',
                        action: function() {
                              return editAction(block);
                        },
                        type: ['original']
                  },
                  /**
                   * Open Block
                   * 
                   */
                  {
                        title: 'Block öffnen',
                        icon: 'fullscreen',
                        action: function() {
                              $B = new Block(block._id);
                              window.currentBlockId = block._id;
                              $B.load(function() {
                                    $B.output($B, function() {
                                          console.log('success, following your block:');
                                    });
                              });
                        },
                        type: ['original', 'clone']
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
                                    $B = new Block(block.data.parent);
                                    window.currentBlockId = block.data.parent;
                                    $B.load(function() {
                                          $B.output($B, function() {
                                                console.log('success!');
                                          });
                                    });
                              }
                        },
                        type: ['original', 'clone']
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
                                    let reload = false;
                                    let props = {
                                          parent: block._id,
                                          content_type: type
                                    };
                                    if (ancestor !== undefined) {
                                          props.ancestor = ancestor;
                                    }
                                    if (type === 'clone') {
                                          props.type = 'clone';
                                          reload = true;
                                    }
                                    new Block(props, function(newBlock) {
                                          block.append(newBlock, function() {
                                                if (reload) {
                                                      $B.load(function() {
                                                            $B.output($B, function() {});
                                                      });
                                                }
                                                else {
                                                      return editAction(newBlock);
                                                }
                                          });
                                    });
                              });
                        },
                        type: ['original']
                  },
                  // { title: 'Block unterordnen', icon: 'angle-double-right' },
                  {
                        title: 'Block nach oben',
                        icon: 'arrow-up',
                        type: ['original', 'clone'],
                        action: function() {
                              block.move('up', function() {
                                    // Reload block
                                    // TODO: don't reload whole block
                                    $B.load(function() {
                                          $B.output($B, function() {
                                                console.log('success!');
                                          });
                                    });
                              });
                        }
                  },
                  {
                        title: 'Block nach unten',
                        icon: 'arrow-down',
                        type: ['original', 'clone'],
                        action: function() {
                              block.move('down', function() {
                                    // Reload block
                                    // TODO: don't reload whole block
                                    $B.load(function() {
                                          $B.output($B, function() {
                                                console.log('success!');
                                          });
                                    });
                              });
                        }
                  },
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
                                    let parentBlock = findBlockById(block.data.parent, $B);
                                    for (let i in parentBlock.data.children) {
                                          if (parentBlock.data.children[i].data._id === block.data._id) {
                                                parentBlock.data.children.splice(i, 1);
                                                break;
                                          }
                                    }
                                    block.contentDom.removeChild(block.dom.row);
                              });
                        },
                        type: ['original', 'clone']
                  },
                  /**
                   * 
                   * Overwrite clone/copy BLock
                   * 
                   * 
                   */
                  {
                        title: 'Block überschreiben',
                        icon: 'layout-sidebar-right',
                        action: function() {
                              alert('Funktion noch nicht implementiert');
                        },
                        type: ['copy']
                  }
            ];
            for (let i = 0; i < block.blockPanelMenu.length; i++) {
                  if (block.blockPanelMenu.hasOwnProperty(i)) {
                        menuPoints = menuPoints.concat(block.blockPanelMenu[i](block));
                  }
            }
            return menuPoints;
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

            const menuPoints = getMenu(block);


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
                  tools.className = 'ibox-tools dropdown';
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
                  menu.setAttribute('role', 'menu');
                  // read items
                  let menuPointsCount = 0;
                  for (let i = 0; i < menuPoints.length; i++) {
                        if (menuPoints[i].type.indexOf(block.data.type) > -1) {
                              menuPointsCount++;
                              let a = document.createElement('a');
                              a.className = 'dropdown-item';
                              let icon = document.createElement('i');
                              icon.className = 'ti-' + menuPoints[i].icon;
                              icon.style.marginRight = '5px';
                              a.appendChild(icon);
                              a.innerHTML += menuPoints[i].title;
                              a.onclick = menuPoints[i].action;
                              menu.appendChild(a);
                        }
                  }
                  if (menuPointsCount) {
                        tools.appendChild(menu);
                        $(menuButton).dropdown();
                  }

                  return head;
            }();



            this.content = function() {
                  // div Container
                  let div = document.createElement('div');
                  div.className = 'ibox ibox-fullheight';
                  div.style.height = 'calc(100% - 5px)';
                  div.style.marginBottom = '5px';
                  div.style.background = block.isClone ? '#FFFFCC' : 'white';

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
                        // Load Variables of selected block
                        block.variables();

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
