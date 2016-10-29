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
  });
});
