$(function() {

  $( "i.search" ).on( "click", function() {
    if($(this).hasClass('selected') === true){
      $(this).removeClass('selected')
      $('.info').removeClass('selected')
      // $(this).html('help_outline')
    }else{
      // console.log('click')
      $(this).addClass('selected')
      $('.info').addClass('selected')
      // $(this).html('highlight_off')
    }
  });

});