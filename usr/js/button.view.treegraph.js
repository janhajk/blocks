var buttonTreegraph = function(type,title,target) {  
  buttonTreegraph.parent.init.call(this,type,title,target,'g');
};
buttonTreegraph.prototype             = new oButton();
buttonTreegraph.prototype.constructor = oButton;
buttonTreegraph.parent                = oButton.prototype; 


/**
 * Click Event
 */
buttonTreegraph.prototype.click = function() {
  $('#middle').empty().append('<div id="tree-container" style="background-color:white"></div>');
  addCssPlain('g.node{font-family: Verdana, Helvetica;font-size: 12px;font-weight: bold;}circle.node-dot {fill: lightsalmon;stroke: red;stroke-width: 1px;}path.link {fill: none;stroke: gray;}');
  var visit = function(parent, visitFn, childrenFn) {
      if (!parent) {return;}
      visitFn(parent);
      var children = childrenFn(parent);
      if (children) {
          var count = children.length;
          for (var i = 0; i < count; i++) {
              visit(children[i], visitFn, childrenFn);
          }
      }
  };    
  var treeData = l.data.treegraph(l.data.selected);
  
  if (typeof d3 === 'undefined') {
    loadScript('lib/d3/d3.v2.min.js', function(){
      function buildTree(containerName, customOptions) {
          // build the options object
          var options = $.extend({nodeRadius: 5, fontSize: 12}, customOptions);
          // Calculate total nodes, max label length
          var totalNodes = 0;
          var maxLabelLength = 0;
          visit(treeData, function(d) {
              totalNodes++;
              maxLabelLength = Math.max(d.name.length, maxLabelLength);
            }, function(d) {
              return d.contents && d.contents.length > 0 ? d.contents : null;
          });

          // size of the diagram
          var size = { width:$(containerName).outerWidth(), height: totalNodes * 15};

          var tree = d3.layout.tree()
              .sort(null)
              .size([size.height, size.width - maxLabelLength*options.fontSize])
              .children(function(d) {
                  return (!d.contents || d.contents.length === 0) ? null : d.contents;
              });

          var nodes = tree.nodes(treeData);
          var links = tree.links(nodes);


          // <g class="container" />
          var layoutRoot = d3.select(containerName)
              .append("svg:svg").attr("width", size.width).attr("height", size.height)
              .append("svg:g")
              .attr("class", "container")
              .attr("transform", "translate(" + maxLabelLength + ",0)");

          // Edges between nodes as a <path class="link" />
          var link = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });

          layoutRoot.selectAll("path.link")
              .data(links)
              .enter()
              .append("svg:path")
              .attr("class", "link")
              .attr("d", link);


          /* Nodes
           * <circle class="node-dot" /><text>
           * Circles with Text
           */ 
          var nodeGroup = layoutRoot.selectAll("g.node")
              .data(nodes)
              .enter()
              .append("svg:g")
              .attr("class", "node")
              .attr("transform", function(d) {
                  return "translate(" + d.y + "," + d.x + ")";
              });
          // Circle
          nodeGroup.append("svg:circle").attr("class", "node-dot").attr("r", options.nodeRadius);
          // Text
          nodeGroup.append("svg:text")
              .attr("text-anchor", function(d) {
                  return d.children ? "end" : "start";
              })
              .attr("dx", function(d) {
                  var gap = 2 * options.nodeRadius;
                  return d.children ? -gap : gap;
              })
              .attr("dy", 3)
              .text(function(d) {
                  return d.name;
              });
      }
      buildTree("#tree-container");
    });
  }
  else {
      function buildTree(containerName,customOptions){var options=$.extend({nodeRadius:5,fontSize:12},customOptions);var totalNodes=0;var maxLabelLength=0;visit(treeData,function(d){totalNodes++;maxLabelLength=Math.max(d.name.length,maxLabelLength)},function(d){return d.contents&&d.contents.length>0?d.contents:null});var size={width:$(containerName).outerWidth(),height:totalNodes*15};var tree=d3.layout.tree().sort(null).size([size.height,size.width-maxLabelLength*options.fontSize]).children(function(d){return(!d.contents||d.contents.length===0)?null:d.contents});var nodes=tree.nodes(treeData);var links=tree.links(nodes);var layoutRoot=d3.select(containerName).append("svg:svg").attr("width",size.width).attr("height",size.height).append("svg:g").attr("class","container").attr("transform","translate("+maxLabelLength+",0)");var link=d3.svg.diagonal().projection(function(d){return[d.y,d.x]});layoutRoot.selectAll("path.link").data(links).enter().append("svg:path").attr("class","link").attr("d",link);var nodeGroup=layoutRoot.selectAll("g.node").data(nodes).enter().append("svg:g").attr("class","node").attr("transform",function(d){return"translate("+d.y+","+d.x+")"});nodeGroup.append("svg:circle").attr("class","node-dot").attr("r",options.nodeRadius);nodeGroup.append("svg:text").attr("text-anchor",function(d){return d.children?"end":"start"}).attr("dx",function(d){var gap=2*options.nodeRadius;return d.children?-gap:gap}).attr("dy",3).text(function(d){return d.name})}buildTree("#tree-container");    
  }
};


/*
 * Daten als Treegraph-Objekt formatieren
 * Erweitert das data Objekt um add Funktion
 */
data.prototype.treegraph = function(cid) {  
  var chapterRecursive = function(cid) {
    var data = l.data.data[cid], c, json={}, content;
    json.name = data.content.replace(/<(?:.|\n)*?>/gm, '');
    json.contents = [];
    // Content
    for (c in data.children[1]) {
      content = l.data.data[data.children[1][c]].content;
      content = content.replace(/<(?:.|\n)*?>/gm, '');
      json.contents.push({name:content.substr(0,40)});
    }
    // Subchapters
    for (c in data.children[0]) {
      json.contents.push(chapterRecursive(data.children[0][c]));
    }
    return json;
  };
  return chapterRecursive(cid);
};


