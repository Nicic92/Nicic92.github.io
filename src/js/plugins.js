particlesJS.load('particles-js', './particles.json', function() {
  console.log('particles.js loaded - callback');
}); 

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
//*************************************************************************
 function blinker() {
        $('.blinking').fadeOut(500);
        $('.blinking').fadeIn(500);
        }
        setInterval(blinker, 1000);
 //header reveal

function fadeTextLine(){
    $('.hzline , .glitchtxt').fadeTo(1000, 1)};

        $(window).load(function(){
            $('.portinfo').fadeTo(2000, 0.9),setTimeout(function(){fadeTextLine()},3500);
        });

function baffleuser() {
  var b = baffle('.user-name').start().reveal(2500, 1500);
}

$(window).load(function(){baffleuser();});

 var binary = ['0', '1'];
function initialize() {
    var d = baffle('.binaryrand', { characters: binary, speed: 80 }).start().reveal(3000, 2000);
}
$('binaryrand');

//Heart text shuffle
function keyboardsw() {

    var c = baffle('.omega').start().text(function (text) {
        return 'Keyboard';
    }).reveal(3000, 1000);
};

function heartsw() {
    var g = baffle('.omega').start().text(function (text) {
        return 'Heart';
    }).reveal(3000, 1000);
};

    setInterval(function(){
         keyboardsw();
   setTimeout(function(){
         heartsw();}, 5000);
    },1e4 );

//elements fade in's
$(window).load(function(){

  $('.devicon').css("display","block");

    $('.devicon').waypoint(function() {
      $('.devicon').addClass('animated fadeInDown'),initialize(),setTimeout(function() {
        $(".devicon :nth-child(3)").addClass("blinking");
    }, 2100);;
      this.destroy();
  },
   { offset: '75%' });
    
    $('.hire').css('opacity', 0);
    $('.hire').waypoint(function() {
      $('.hire').addClass('animated fadeIn');
      $('.name-box').addClass('animated fadeInDown');
      $('.email-box').addClass('animated fadeInRight');
      $('.msg-box').addClass('animated fadeInLeft');
      $('.button').addClass('animated fadeInUp');
  }, { offset: '80%' });
 
    $('.withLove').css('opacity', 0);
    $('.withLove').waypoint(function() {
      $('.withLove').addClass('animated fadeInUp');
      
  },
   { offset: '95%' });
    });


 $(document).load(function(){
        $('.particles-js-canvas-el').addClass('animated zoomIn');
    });

//Card hover effect 
// $(function(){
//     $('.col-sm-3').hover(function(){
//         $(this).addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
//                 $(this).removeClass('animated bounce');
//         });
//     });
// });

 $(".fa-envelope").click(function() {
    $('html,body').animate({
        scrollTop: $(".hire").offset().top},
        2000);
});

 $(function() {
    $(".col-sm-3").hover(function(){
    $(this).stop().animate({"top" : "-35px"},200);
    }, function(){
    $(this).stop().animate({"top": "0"},200);
    });
    });