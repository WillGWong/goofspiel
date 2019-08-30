$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});

const guncock = "images/guncock.mp3"

$(document).ready(function(){
  $("#1").click(function(){
    $("input:text").val("1");
  });

  $("#2").click(function(){
    $("input:text").val("2");
  });

  $("#3").click(function(){
    $("input:text").val("3");
  });

  $("#4").click(function(){
    $("input:text").val("4");
  });

  $("#5").click(function(){
    $("input:text").val("5");
  });

  $("#6").click(function(){
    $("input:text").val("6");
  });

  $("#7").click(function(){
    $("input:text").val("7");
  });
});
