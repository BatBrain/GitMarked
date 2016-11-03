var repoURL = repoURL
var subID = subID
var currentFilePath;

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
              currentFilePath = data.node.original.id
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

$( document ).ready(function(){
  $("#comments").append(stupidCommentForm)
  $("#addNewComment").on("submit", function(event, data){
    debugger
    let selection = editor.listSelections()[0]
    let postData = {
      subID: subID,
      path: currentFilePath,
      line_start: selection.anchor.line + 1,
      line_end: selection.head.line + 1,
      text: this[0].value,
      title: this[1].value,
      type: this[2].value,
      success: function(){},
    }
    event.preventDefault()
    $.ajax({
      type: "POST",
      url: "/addNewComment",
      data: postData
    })
    .then( function(data, status, code){
      debugger
      return data
      $("#addNewComment").submit()
    }, function(code, status, error){
      alert("Issue with creating a function: ", code, status, error)
    })
  })
})

let stupidCommentForm = `<form id="addNewComment" style="padding-left: 5%;">
<legend>Add Comment</legend>
<label for="comment-text">Comment Text</label>
<div>
  <textarea id="comment-text" name="comment-text" rows="5" required="true" style="width: 95%;"></textarea>
</label>
</div>
<label>Comment Title
<div>
  <input id="comment-title" name="comment-title" type="text" required="true"  style="width: 95%;">
</label>
</div>
<label>Color
<div>
  <input id="color" name="color" list="color-names" type="text" required=""  style="width: 95%;">
  (yellow is default)
  <datalist id="color-names">
    <option label="medium-red" value="bg-medium-red"></option>
    <option label="medium-green" value="bg-medium-green"></option>
    <option label="medium-yellow" value="bg-medium-yellow"></option>
    <option label="medium-blue" value="bg-medium-blue"></option>
    <option label="medium-maroon" value="bg-medium-maroon"></option>
    <option label="medium-purple" value="bg-medium-purple"></option>
    <option label="medium-orange" value="bg-medium-orange"></option>
    <option label="medium-cyan" value="bg-medium-cyan"></option>
    <option label="medium-pink" value="bg-medium-pink"></option>
    <option label="medium-red" value="bg-medium-red"></option>
    <option label="medium-green" value="bg-medium-green"></option>
    <option label="medium-yellow" value="bg-medium-yellow"></option>
    <option label="medium-blue" value="bg-medium-blue"></option>
    <option label="medium-maroon" value="bg-medium-maroon"></option>
    <option label="medium-purple" value="bg-medium-purple"></option>
    <option label="medium-orange" value="bg-medium-orange"></option>
    <option label="medium-cyan" value="bg-medium-cyan"></option>
    <option label="medium-pink" value="bg-medium-pink"></option>
  </datalist>
</label>
</div>
</form>
<button id="submitCommentButton" style="background-color: white; text-align: center; border-radius: 5px; border: 1px solid black; padding-top: 5px; margin-right: 5%; margin-top: 10%; padding-bottom: 5px;">Submit Comment</button>`

  // <div id="submitCommentButton" style="background-color: white; text-align: center; border-radius: 5px; border: 1px solid black; padding-top: 5px; margin-right: 5%; margin-top: 10%; padding-bottom: 5px;">
  //   Submit Comment
  // </div>
