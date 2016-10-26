"use strict"
var treeMaster = [];

var treeMaker = function(event, object) {
    //console.log()
    if (object.type == "tree") {
      $.ajax({
        method: "GET",
        url: object.url,
      }).done((response) => {
        console.log(object)
        console.log(treeMaster)
        treeMaster[object.tags].nodes = populateTree(response)
        $('#tree').treeview({data: treeMaster, onNodeSelected: treeMaker});
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

//https://api.github.com/repos/BatBrain/ar-excercises/git/trees/aef6baccc89b2a11545438510c379b6034aa189f
//const treeview = require("bootstrap-treeview");
function populateTree(res){
  var passUp = res.tree.map((cv, index, arr) => {
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
      object.tags = index
      if (object.type == "tree") { object.nodes = [] }
      //console.log(object)
      return object;
    })
    return passUp
  }

  $(() => {
    $.ajax({
      method: "GET",
      url: "https://api.github.com/repos/BatBrain/ar-excercises/git/trees/aef6baccc89b2a11545438510c379b6034aa189f",
    }).done((response) => {
      treeMaster = populateTree(response)
      console.log(treeMaster)
        // var data2 = data1.reduce(function(acc,cv,ci,arr){
        //     var path = cv.text
        //     //console.log(path.split('/'))
        //     var howmany = path.split('/')
        //     if (howmany.length > 1){
        //       if (!cv.nodes) {cv.nodes = []}
        //       cv.nodes.push(cv)
        //       }
        //     return acc
        // });
        // console.log(data2)
        // $("body").append(JSON.stringify(data2))
        $('#tree').treeview({data: treeMaster, onNodeSelected: treeMaker});
    })
  })
// $('#tree').on('nodeSelected', function(event, object){
//   //event.preventDefault()
//
// }
