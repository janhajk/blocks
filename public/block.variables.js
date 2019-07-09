/*global Block */
/*global $ */
/*global async*/
/*global $B*/
(function() {
      let properties;
      let box;

      /**
       * create content-box for variables in tab-2
       * 
       */
      document.addEventListener('DOMContentLoaded', function() {
            properties = document.getElementById('tab-2');
            let iBox = document.createElement('div');
            iBox.className = 'ibox';
            properties.appendChild(iBox);
            let iBoxHead = document.createElement('div');
            iBoxHead.className = 'ibox-head';
            let iBoxBody = document.createElement('div');
            iBoxBody.className = 'ibox-body';
            iBox.appendChild(iBoxHead);
            iBox.appendChild(iBoxBody);
            let content = document.createElement('div');
            iBoxBody.appendChild(content);
            let title = document.createElement('div');
            title.className = 'ibox-title';
            title.innerHTML = 'Variablen/Platzhalter';
            iBoxHead.appendChild(title);
            $(content).slimScroll();
            box = content;

      });

      let varItemDom = function(self, varName, value) {
            let li = document.createElement('li');
            li.className = 'list-group-item';
            let label = document.createElement('label');
            label.className = 'col-sm-2 col-form-label';
            label.innerHTML = varName;
            let inputDiv = document.createElement('div');
            inputDiv.className = 'col-sm-10';
            let input = document.createElement('input');
            input.className = 'form-control';
            input.type = 'text';
            input.value = value;
            // Save changes
            input.onkeypress = function(key) {
                  if (key.keyCode === 13) { // Enter
                        // if (this.value !== '') {
                        self.data.variables[varName] = this.value;
                        // }
                        let nonEmptyVariables = {};
                        for (let i in self.data.variables) {
                              if (self.data.variables.hasOwnProperty(i) && self.data.variables[i] !== '') {
                                    nonEmptyVariables[i] = self.data.variables[i];
                              }
                        }
                        self.saveValue('variables', nonEmptyVariables, function() {
                              $B.load(function() {
                                    $B.output($B, function() {});
                              });
                        });
                  }
            };

            li.appendChild(label);
            li.appendChild(inputDiv);
            inputDiv.appendChild(input);
            return li;
      };

      /**
       * 
       * Finds all unique Variables recursive in a block and returns array
       * 
       */
      Block.fn.findAllVariables = function(next) {
            let variables = [];
            async.each(this.data.children, function(child, callback) {
                        let content = child.data.content;
                        let res = content.match(/(%[a-zA-Z_]*?%)/g);
                        if (res !== null && res.length) {
                              variables = variables.concat(res).unique();
                        }
                        child.findAllVariables(function(vars) {
                              variables = variables.concat(vars).unique();
                              callback();
                        });
                  },
                  // when async finishes / all has loaded
                  function(e) {
                        next(variables); // report block and children loaded
                  }
            );
      };

      /**
       * Reads all variables, merges them with saved ones and displays them
       * on the list
       * 
       * gets called when opening Block.details()
       */
      Block.fn.variables = function() {
            let self = this; // block

            // clear list
            while (box.firstChild) {
                  box.removeChild(box.firstChild);
            }

            // Prohibit setting variables for copies
            if (self.data.type === 'copy') return;

            this.findAllVariables(function(variables) {
                  // Extend existing variables with new ones
                  for (let i = 0; i < variables.length; i++) {
                        if (self.data.variables[variables[i]] === undefined) {
                              self.data.variables[variables[i]] = '';
                        }
                  }

                  let ul = document.createElement('ul');
                  box.appendChild(ul);
                  ul.className = 'list-group list-group-full';
                  for (let i in self.data.variables) {
                        if (self.data.variables.hasOwnProperty(i)) {
                              ul.appendChild(varItemDom(self, i, self.data.variables[i]));
                        }
                  }
            });

      };

      /**
       * hook contentFormatter
       * 
       * gets called when content is formated
       * 
       */
      Block.fn.contentFormatter.push({
            weight: 0,
            format: function(content, self) {
                  let format = function(content, variable) {
                        let styles = [
                              // 'background:yellow',
                        ];
                        let c = '<span class="bg-yellow" style="' + styles.join(';') + '" title="' + variable + '">' + content + '</span>';
                        return c;
                  };
                  for (let i in self.data.variables) {
                        if (self.data.variables.hasOwnProperty(i)) {
                              let replace = new RegExp(i, 'g');
                              content = content.replace(replace, format(self.data.variables[i], i));
                        }
                  }
                  return content;
            }
      });


      /**
       * helper function to remove all duplicate items in an array
       */
      Array.prototype.unique = function() {
            var a = this.concat();
            for (var i = 0; i < a.length; ++i) {
                  for (var j = i + 1; j < a.length; ++j) {
                        if (a[i] === a[j])
                              a.splice(j--, 1);
                  }
            }
            return a;
      };


}());
