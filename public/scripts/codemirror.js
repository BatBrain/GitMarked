CodeMirror.modeURL = "../codemirror/mode/%N/%N.js";
var editor = CodeMirror(document.body, {
  lineWrapping: true,
  lineNumbers: true,
  showCursorWhenSelecting: true,
  value: "Blank",
  mode:  "ruby"
});
$(() => {
  $.ajax({
    method: "GET",
    url: "https://raw.githubusercontent.com/BatBrain/ar-excercises/711d67306bb5d11a1018e09fb33a2249c81355a8/exercises/exercise_5.rb",
  }).done((response) => {
    editor.setValue(response)
    highlightLine([2, 4, 6, 8, 10])
  });
});


function highlightLine(lineNumber) {
  lineNumber.forEach((cv, index) => {
    var actualLineNumber = cv - 1;
    editor.addLineClass(actualLineNumber, 'wrap', 'bg-warning');
  })
   //Line number is zero based index
   //Select editor loaded in the DOM
   //var myEditor = $("#body_EditorSource .CodeMirror");
   //console.log(myEditor);
   //console.log(myEditor[0].CodeMirror);
   //var codeMirrorEditor = myEditor[0].CodeMirror;
   //Set line css class

}
