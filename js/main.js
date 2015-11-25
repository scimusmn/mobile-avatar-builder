/**
 *
 * Example usage of AvatarSwiper.js
 *
 */

$(document).ready(function() {

  // Image arrays for each layer of customization
  var bodyImages = [];
  for (var i = 1; i <= 5; i++) { bodyImages.push('img/body/body_' + i + '.png'); };

  var headImages = [];
  for (var i = 1; i <= 5; i++) { headImages.push('img/head/head_' + i + '.png'); };

  var faceImages = [];
  for (var i = 1; i <= 5; i++) { faceImages.push('img/face/face_' + i + '.png'); };

  var hairImages = [];
  for (var i = 1; i <= 6; i++) { hairImages.push('img/hair/hair_' + i + '.png'); };

  // Setup swipeshow.
  var options = {
                    slideWidth: 200,

                    slideHeight: 400,

                    overlap: 40,

                    confirmBtn: $('#confirmBtn'),

                    onSwitchLayer: function(nextLayerId) {
                      $('.highlight').text(nextLayerId);
                    },

                    onComplete: function(selections) {
                      $('#instructions').html(JSON.stringify(selections));

                      floatUpDown($('.swipeshow img'));

                    },

                  };

  var avatarSwiper = new AvatarSwiper($('#avatar_swiper'), options);

  avatarSwiper.addLayer('head', headImages, 2);
  avatarSwiper.addLayer('face', faceImages, 3);
  avatarSwiper.addLayer('hair', hairImages, 4);
  avatarSwiper.addLayer('body', bodyImages, 1);

  avatarSwiper.init();

});

var up = false;
function floatUpDown(element) {

  var rpad1 = 0;
  if (up === false) {
    rpad1 = 120;
    up = true;
  } else {
    up = false;
  }

  $(element).animate({

    'padding-top': rpad1,

  }, 450, function() {

      floatUpDown(element);

  });

}

