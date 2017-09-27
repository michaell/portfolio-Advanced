$(document).ready(function(){
    blur();
  })
  $(window).resize(function(){
    blur();
  });
  
  function blur() {
    var imgWidth = $('.blur__back').width(),
        blurSection = $('.reviews'),
        blur = $('.blur-form'),
        posY = blurSection.offset().top - blur.offset().top, //   текущее положение элемента относительно документа.
        posX = blurSection.offset().left - blur.offset().left;
    
    blur.css({
        'background-size': imgWidth + 'px' + ' ' + 'auto',
        'background-position': posX + 'px' + ' ' + posY + 'px'
    })
  }