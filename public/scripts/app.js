$(document).ready(function(){
  $("#1").click(function(){
    $('#guncock')[0].play();
    $("input:text").val("1")
  });

  $("#2").click(function(){
    $('#guncock')[0].play();
    $("input:text").val("2");
  });

  $("#3").click(function(){
    $('#guncock')[0].play();
    $("input:text").val("3");
  });

  $("#4").click(function(){
    $('#guncock')[0].play();
    $("input:text").val("4");
  });

  $("#5").click(function(){
    $('#guncock')[0].play();
    $("input:text").val("5");
  });

  $("#6").click(function(){
    $('#guncock')[0].play();
    $("input:text").val("6");
  });

  $("#7").click(function(){
    $('#guncock')[0].play();
    $("input:text").val("7");
  });

  $(".drawbutton").click(function(event){
    event.preventDefault()
    $('#gunshot')[0].play();
    let bid = $("#player_bid").val()
    $.post("bid/", {player_bid: bid})
    setTimeout(() => {location.reload(true)}, 1000)

  });

});
