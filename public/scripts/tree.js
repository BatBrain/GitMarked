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

//examples url https://api.github.com/repos/DanBrooker/file-icons/git/trees/0f5d7379b0556c0d2e99110e2b6d9012922c9c31
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
            },
            "types": {
              ".atom": {
                  "icon" : false,
                  "a_attr": {"class" : "icon-file-directory", "data-name":".atom"}
                }
            },
            "plugins": ["theme", "types"]
          });
        })
    console.log("Treemaster:", treeMaster)

    //$('#tree').jstree({ 'core' : { 'data' : JSON.stringify(treeMaster) } });
  })

function populateTree(res){
  var tree = res.tree.map((cv, index, arr) => {
    var pathArr = cv.path.split("/");
    var fileExt = cv.path.split(".")
    console.log("File extention: ", fileExt)
    var object = {
      "id" : cv.path,
      "text" : pathArr[pathArr.length - 1],
      "parent" : parentMaker(pathArr),
      "icon" : false,
      "a_attr" : typeMaker(fileExt)
    };
      return object;
    })
  console.log("Tree:", tree)
  return tree
  }

function typeMaker(fileExt){
  console.log("typeMaker input: ", fileExt)
  if (fileExt.length > 1){
    var attr = {"class" : "icon-file-directory", "data-name": `.${fileExt[fileExt.length - 1]}`}
    console.log("ATTR:", attr)
    return attr
  } else {
    return "folder"
  }
}

function parentMaker(splitPath) {
  if (splitPath.length > 1) {
    return splitPath.slice(0, -1).join('/');
  } else {
    return "#"
  }
}
