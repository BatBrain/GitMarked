function loadLESS ( filename ) {
   // If LESS isn't available, do nothing
   if ( !window.less ) { return;}

   // Create LESS link and add to <head>
   var $link = $("<link type='text/css' rel='stylesheet/less' />");
   $link.attr("href", filename + ".less");
   $("head").append( $link );

   // Notify LESS that there is a new stylesheet
   less.sheets.push( $link[0] );
   less.refresh();
}

loadLESS("/stylesheets/file-icons")

var treeMaster;
$(() => {
  console.log('fn');
  $.ajax({
    method: "GET",
    url: "https://api.github.com/repos/BatBrain/ar-excercises/git/trees/aef6baccc89b2a11545438510c379b6034aa189f?recursive=1",
  }).done((response) => {
          treeMaster = populateTree(response)
          $.jstree.defaults.core.data
          $('#tree').jstree({
            "core" : {
              "data" : treeMaster
            }
          });
        })
    console.log("Treemaster:", treeMaster)

    //$('#tree').jstree({ 'core' : { 'data' : JSON.stringify(treeMaster) } });
  })

function populateTree(res){
  var tree = res.tree.map((cv, index, arr) => {
    var pathArr = cv.path.split("/");
    var fileExt = cv.path.split(".")
    var object = {
      "id" : cv.path,
      "text" : pathArr[pathArr.length - 1],
      "parent" : parentMaker(pathArr),
      "icon" : function(){
        if (fileExt > 1){
          return fileExt[fileExt.length - 1]
        } else {
          return "folder"
        }
      }
    };
      return object;
    })
  console.log("Tree:", tree)
  return tree
  }

function parentMaker(splitPath) {
  if (splitPath.length > 1) {
    return splitPath.slice(0, -1).join('/');
  } else {
    return "#"
  }
}
