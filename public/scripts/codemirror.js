"use strict"

CodeMirror.modeURL = "../codemirror/mode/%N/%N.js";
let editor = CodeMirror(document.getElementById("editor"), {
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
    let actualLineNumber = cv - 1;
    editor.addLineClass(actualLineNumber, 'wrap', 'bg-warning');
  })
};

let sampleComments = [
  {
    start: 1,
    end: 3,
    text: "Hi this is a test comment! Comments look super wonderful and are very handy!",
    color: "green"
  },
  {
    start: 5,
    end: 5,
    text: "Single line comment here!",
    color: "green"
  },
  {
    start: 7,
    end: 8,
    text: "This comment is orange!",
    color: "orange",
  },
  {
    start: 9,
    end: 10,
    text: "This comment is yellow!",
    color: "yellow"
  },
  {
    start: 11,
    end: 12,
    text: "This comment is blue!",
    color: "blue"
  }
]
