jQuery(document).ready(function($) {
  $(".sidebar").mouseenter(function() {
      $(".comment-container").hide();
  });

  $(".sidebar").mouseleave(function() {
      $(".comment-container").show();
  });
});