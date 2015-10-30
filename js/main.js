/**
 * AvatarSwiper
 *
 * Use layers of assets to quickly create
 * a personalized avatar. Requires jquery
 * and swipeshow.js.
 *
 */

$(document).ready(function() {

  // Target body assets
  var bodyAssets = [];
  for (var i = 1; i <= 5; i++) { bodyAssets.push('img/body/body_' + i + '.png'); };

  // Target head assets
  var headAssets = [];
  for (var i = 1; i <= 5; i++) { headAssets.push('img/head/head_' + i + '.png'); };

  // Target face assets
  var faceAssets = [];
  for (var i = 1; i <= 5; i++) { faceAssets.push('img/face/face_' + i + '.png'); };

  // Target hair assets
  var hairAssets = [];
  for (var i = 1; i <= 6; i++) { hairAssets.push('img/hair/hair_' + i + '.png'); };

  // Setup swipeshow.
  var options = {};
  var avatarSwiper = new AvatarSwiper($('#avatar_swiper'), options);

  avatarSwiper.addLayer(headAssets);
  avatarSwiper.addLayer(faceAssets);
  avatarSwiper.addLayer(hairAssets);
  avatarSwiper.addLayer(bodyAssets);

  avatarSwiper.init();

});
