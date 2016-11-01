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
    highlightLine(sampleComments)
  });
});

function colorFind(color){
  if (color) {
    return color
  } else {
    return "bg-light-yellow"
  }
}

function highlightLine(comments) {
  comments.forEach((cv, index) => {
    let start = cv.start - 1;
    for (var i = start; i < cv.end; i++){
      editor.addLineClass(i, 'wrap', colorFind(cv.color));
    }
  })
};

let sampleComments = [
  {
    start: 1,
    end: 3,
    text: "Hi this is a test comment! Comments look super wonderful and are very handy!",
    color: undefined
  },
  {
    start: 5,
    end: 5,
    text: "Single line comment here!",
    color: "bg-medium-green"
  },
  {
    start: 7,
    end: 8,
    text: "This comment is orange!",
    color: "bg-medium-orange",
  },
  {
    start: 10,
    end: 10,
    text: "This comment is yellow!",
    color: "bg-medium-yellow"
  },
  {
    start: 11,
    end: 12,
    text: "This comment is blue!",
    color: "bg-medium-blue"
  }
]
