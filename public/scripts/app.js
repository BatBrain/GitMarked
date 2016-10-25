//var CodeMirror = require([
//  "public/codemirror/cm/lib/codemirror", "public/codemirror/cm/mode/htmlmixed/htmlmixed"
//], function(CodeMirror) {
  CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    mode: "htmlmixed"
  });
//});

//var myCodeMirror = CodeMirror.fromTextArea(myTextArea);
// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });
