$(document).ready(function () {
  $('.ct_menu_bar').click(function () {
    $(".ct_navlist ul").addClass('active')
  })
  $('.ct_close_bar').click(function () {
    $(".ct_navlist ul").removeClass('active')
  })
})

$(document).on("click", function (e) {
  if (!$(e.target).closest(".ct_menu_bar").length) {
    $(".ct_navlist ul").removeClass("active");
  }
});
// Wrap every letter in a span
// var textWrapper = document.querySelector('.ml10 .letters');
// textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

// anime.timeline({loop: true})
//   .add({
//     targets: '.ml10 .letter',
//     rotateY: [-90, 0],
//     duration: 1300,
//     delay: (el, i) => 45 * i
//   }).add({
//     targets: '.ml10',
//     opacity: 0,
//     duration: 1000,
//     easing: "easeOutExpo",
//     delay: 1000
//   });

$('.ct_ads_slider').owlCarousel({
  loop: true,
  margin: 10,
  nav: true,
  responsive: {
    0: {
      items: 1
    },
    600: {
      items: 2
    },
    1000: {
      items: 3
    }
  }
})

new WOW().init();

var a = 0;
$(window).scroll(function () {

  var oTop = $('#counter').offset()?.top - window.innerHeight;
  if (a == 0 && $(window).scrollTop() > oTop) {
    $('.counter-value').each(function () {
      var $this = $(this),
        countTo = $this.attr('data-count');
      $({
        countNum: $this.text()
      }).animate({
        countNum: countTo
      },

        {

          duration: 2000,
          easing: 'swing',
          step: function () {
            $this.text(Math.floor(this.countNum));
          },
          complete: function () {
            $this.text(this.countNum);
            //alert('finished');
          }

        });
    });
    a = 1;
  }

});


// $('.ct_listing_slider').owlCarousel({
//   loop: true,
//   margin: 20,
//   nav: false,
//   responsive: {
//     0: {
//       items: 1
//     },
//     600: {
//       items: 2
//     },
//     1000: {
//       items: 2
//     }
//   }
// })


$('.ct_login_slider').owlCarousel({
  loop: true,
  animateIn: 'fadeIn',
  margin: 10,
  autoplayTimeout: 3000,

  nav: true,
  autoplay: 3000,
  //    smartSpeed:1000,
  slideSpeed: 2000,
  responsive: {
    0: {
      items: 1
    },
    600: {
      items: 1
    },
    1000: {
      items: 1
    }
  }
})


$(".chat-list a").click(function () {
  $(".chatbox").addClass("showbox");
  return false;
});

$(".chat-icon").click(function () {
  $(".chatbox").removeClass("showbox");
});



$(document).ready(function () {
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;
  var current = 1;
  var steps = $("fieldset").length;

  setProgressBar(current);

  $(".ct_form_next").click(function () {
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();
    window.scrollTo(0, 0);
    //Add Class Active
    $("#ct_form_progressbar li")
      .eq($("fieldset").index(next_fs))
      .addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          next_fs.css({ opacity: opacity });
        },
        duration: 500,
      }
    );
    setProgressBar(++current);
  });

  $(".previous").click(function () {
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();
    window.scrollTo(0, 0);
    //Remove class active
    $("#ct_form_progressbar li")
      .eq($("fieldset").index(current_fs))
      .removeClass("active");

    //show the previous fieldset
    previous_fs.show();

    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          previous_fs.css({ opacity: opacity });
        },
        duration: 500,
      }
    );
    setProgressBar(--current);
  });

  function setProgressBar(curStep) {
    var percent = parseFloat(100 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar").css("width", percent + "%");
  }

  $(".submit").click(function () {
    return false;
  });

  $(".ct_apply_filter_btn").click(function () {
    $(".ct_mobile_filter_category_content").addClass("active");
  });
  $(".ct_category_close_btn").click(function () {
    $(".ct_mobile_filter_category_content").removeClass("active");
  });
});
