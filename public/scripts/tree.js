var repoURL = repoURL
var subID = subID

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
  //console.log('fn');
  $.ajax({
    method: "GET",
    url: repoURL.treeURL,
  }).done((response) => {
          treeMaster = populateTree(response)
          console.log("Treemaster:", treeMaster)
          $.jstree.defaults.core.data
          $('#tree')
            .on('select_node.jstree', function (e, data) {
              //console.log("Delicious Data!:", data)
              if (data.node.original.type == "blob") {
                $.ajax({
                  method: "GET",
                  url: data.node.original.url,
                  headers: {accept: "application/vnd.github.VERSION.raw"}
                }).done((response) => {
                  editor.setValue(response)
                  CodeMirror.modeURL = "../codemirror/mode/%N/%N.js";
                  var val = data.node.text, m, mode, spec;
                  if (m = /.+\.([^.]+)$/.exec(val)) {
                    var info = CodeMirror.findModeByExtension(m[1]);
                    if (info) {
                      mode = info.mode;
                      spec = info.mime;
                    }
                  } else if (/\//.test(val)) {
                    var info = CodeMirror.findModeByMIME(val);
                    if (info) {
                      mode = info.mode;
                      spec = val;
                    }
                  } else {
                    mode = spec = val;
                  }
                  if (mode) {
                    editor.setOption("mode", spec);
                    CodeMirror.autoLoadMode(editor, mode);
                    document.getElementById("modeinfo").textContent = spec;
                  } else {
                    alert("Could not find a mode corresponding to " + val);
                  }
                });
              } else {
                //console.log("Oh look, time to do nothing!")
                return
              }
              getComments(data.node.original)
            })
            .jstree({
            "core" : {
              "data" : treeMaster
            },
            "plugins": ["theme", "types"]
          });
        })


    //$('#tree').jstree({ 'core' : { 'data' : JSON.stringify(treeMaster) } });
  })

function populateTree(res){
  var tree = res.tree.map((cv, index, arr) => {
    var pathArr = cv.path.split("/");
    var fileExt = cv.path.split(".")
    //console.log("File extention: ", fileExt)
    var object = {
      "id" : cv.path,
      "text" : " " + pathArr[pathArr.length - 1],
      "parent" : parentMaker(pathArr),
      "type" : cv.type,
      "url" : cv.url,
      "icon" : false,
      "a_attr" : typeMaker(fileExt, cv, pathArr)
    };
      return object;
    })
  //console.log("Tree:", tree)
  return tree
  }

function typeMaker(fileExt, cv, pathArr){
  //console.log("typeMaker input: ", fileExt)
  if (fileExt.length > 1){
    var attr = {"class" : "icon-file-directory", "data-name": `.${fileExt[fileExt.length - 1]}`}
    //console.log("ATTR:", attr)
    return attr
  } else if (cv.type == "tree"){
    var attr = {"class" : "icon-file-directory", "data-name": ".folder-open"}
    //console.log("ATTR:", attr)
    return attr
  } else if (cv.type == "blob" && fileExt.length == 1) {
    var attr = {"class" : "icon-file-directory", "data-name": ".file-text-o"}
    //console.log("ATTR:", attr)
    return attr
  }
}

function parentMaker(splitPath) {
  if (splitPath.length > 1) {
    return splitPath.slice(0, -1).join('/')
  } else {
    return "#"
  }
}

//highlightLine(sampleComments)

function colorFind(color){
  if (color) {
    return color
  } else {
    return "bg-light-yellow"
  }
}

function highlightLine(comments) {
  comments.forEach((cv, index) => {
    let start = cv.line_start - 1;
    for (var i = start; i < cv.line_end; i++){
      editor.addLineClass(i, 'wrap', colorFind(cv.type));
    }
    let newComment = $( `
      <div class="panel list-group ${colorFind(cv.type)}" data-start="${cv.line_start}" data-end="${cv.line_end}">
        <a id="${index + 1}"></a>
        <button class="list-group-item" data-toggle="collapse" data-target="#item-${index + 1}" data-parent="#accordion"><strong>${cv.title}</strong></button>
        <div id="item-${index + 1}" class="collapse">
          ${cv.text}
        </div>
      </div>
      `)
      $("#comment-list").append(newComment).click(function(event, object){
        (comment_start) => {
          var i = Number(event.target.parentNode.parentNode.dataset.start)
          var t = editor.charCoords({line: i, ch: 0}, "local").top;
          var middleHeight = editor.getScrollerElement().offsetHeight / 2;
          editor.focus()
          editor.setCursor({line: i, ch: 5})
          editor.scrollTo(null, t - middleHeight - 5);
        }
      })
  })
};

function getComments(eventObject){
  $.ajax({
    method: "GET",
    url: `/find/filecomments?id=${subID}&path=${eventObject.id}`,
  }).done((response) => {
    highlightLine(response)
  })
}
