"use strict"

//Global tree (array of objects)
var treeMaster = [];
//=== Instatiates treeview after AJAX call ===================================================================
$(() => {
  $.ajax({
    method: "GET",
    url: "https://api.github.com/repos/BatBrain/ar-excercises/git/trees/aef6baccc89b2a11545438510c379b6034aa189f",
  }).done((response) => {
    treeMaster = populateTree(response)
    treeMaster.forEach(function(node, index){
      if (node.type == "tree") {
        $.ajax({
          method: "GET",
          url: node.url,
        }).done((response) => {
          node.nodes = populateTree(response)
        })
      }
    })
    console.log(treeMaster)
      $('#tree').treeview({data: treeMaster});
  })
})

//=== Conditionally assigns proper onNodeSelected AJAX query ===================================================================

$('#tree').on('nodeSelected', function(event, object) {
  // Your logic goes here
});
var treeMaker = function(event, object) {
  if (object.type == "tree") {
    console.log("EVENT:", event)
    event.preventDefault()
    var selectedNode = $('#tree').treeview('getSelected');
    $.ajax({
      method: "GET",
      url: object.url,
    }).done((response) => {
      console.log("TREEMASTER", treeMaster)
      console.log("OBJECT", object)
      var nodePosition = Number(selectedNode[0].nodeId) * 10
      object.nodes = populateTree(response)
      var newNode = object
      console.log("Selected Node:", selectedNode[0])
      //console.log("New Node:", newNode)
      $('#tree').treeview('updateNode', [ treeMaster[nodePosition], newNode, { silent: true } ]);
      //$('#tree').treeview({data: treeMaster, onNodeSelected: treeMaker});
    })
  } else if (object.type == "blob") {
    $.ajax({
      method: "GET",
      url: object.url,
      headers: {accept: "application/vnd.github.VERSION.raw"}
    }).done((response) => {
      editor.setValue(response)
    });
  }
  }

//Static tree for testing: https://api.github.com/repos/BatBrain/ar-excercises/git/trees/aef6baccc89b2a11545438510c379b6034aa189f
//=== Converts to appropriate object formatting ===================================================================
function populateTree(res){
  var tree = res.tree.map((cv, index, arr) => {
    var object = {};
      object.text = cv.path,
      object.sha = cv.sha,
      object.type = cv.type,
      object.url = cv.url,
      object.icon = "glyphicon glyphicon-stop",
      object.selectedIcon = "glyphicon glyphicon-stop",
      object.color = "#000000",
      object.backColor = "#FFFFFF",
      object.selectable = true,
      object.state = {
        checked: true,
        disabled: false,
        expanded: false,
        selected: false
      },
      object.onNodeSelected = treeMaker,
      object.tags = index
      if (object.type == "tree") { object.nodes = [] }
      //console.log(object)
      return object;
    })
  return tree
  }

//=== Alternative tree function ===================================================================
//May be more viable, investigate later.

// var output = [];
// for (var i = 0; i < input.length; i++) {
//     var chain = input[i].text.split("/");
//     var currentNode = output;
//     for (var j = 0; j < chain.length; j++) {
//         var wantedNode = chain[j];
//         var lastNode = currentNode;
//         for (var k = 0; k < currentNode.length; k++) {
//             if (currentNode[k].text == wantedNode) {
//                 currentNode = currentNode[k].nodes;
//                 break;
//             }
//         }
//         // If we couldn't find an item in this list of nodes
//         // that has the right text, create one:
//         if (lastNode == currentNode) {
//             var newNode = currentNode[k] = input[i];
//             currentNode = newNode.nodes;
//         }
//     }
// }
