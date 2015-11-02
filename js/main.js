/**
 * AvatarSwiper
 *
 * Use layers of Images to quickly create
 * a personalized avatar. Requires jquery
 * and swipeshow.js.
 *
 */

$(document).ready(function() {

  // Make asset arrays.
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

                    slideHeight: 120,

                    confirmBtn: $('#confirmBtn'),

                    onSwitchLayer: function(nextLayerId) {
                      $('#instructions .highlight').text(nextLayerId);
                    },

                    onComplete: function(selections) {
                      $('#instructions').html(JSON.stringify(selections));
                    },

                  };

  var avatarSwiper = new AvatarSwiper($('#avatar_swiper'), options);

  avatarSwiper.addLayer('head', headImages, 2);
  avatarSwiper.addLayer('face', faceImages, 3);
  avatarSwiper.addLayer('hair', hairImages, 4);
  avatarSwiper.addLayer('body', bodyImages, 1);

  avatarSwiper.init();

});
