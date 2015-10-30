/**
 * AvatarSwiper
 *
 * Use layers of assets to quickly create
 * a personalized avatar. Requires jquery
 * and swipeshow.js.
 *
 */

var AvatarSwiper = function(_containerDiv, _options) {

  // Set options and defaults
  if (typeof _options === 'undefined') _options = {};

  this.id = _options.id || 'avt_swiper_' + parseInt(Math.random() * 999);

  this.slideWidth = _options.slideWidth || $(window).width();
  this.slideHeight = _options.slideHeight || $(window).height();

  this.swipeshowOptions = {autostart: false, initial: 0};

  // Track all customizeable layers
  this.swipeLayers = [];
  this.currentLayer = -1;

  // Set up container div for swipeshow.
  this.containerDiv = _containerDiv;
  $(this.containerDiv).addClass('swipeshow');
  $(this.containerDiv).attr('id', this.id);
  $(this.containerDiv).css('width', this.slideWidth);
  $(this.containerDiv).css('height', this.slideHeight);

  this.slidesHTML = $(this.containerDiv).append('<ul class="slides"></ul>');

  /**
   * Add Layer
   *
   * Takes an array of assets and adds to
   * the stack of customizable layers in the
   * creation process. The order each layer
   * is added determines z-depth and order in
   * customization process.
   *
   */
  this.addLayer = function(_imgArray) {

    var layerSlides = [];

    // Create as many slides as assets
    for (var i = 0; i < _imgArray.length; i++) {
      var imgSrc = _imgArray[i];

      // TEMP - r color to distinguish slides....
      var rcolor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      var slide = '<li class="slide" style="background-color:' + rcolor + ';"><img src="' + imgSrc + '"/></li>';

      // var slide = '<li class="slide"><img src="' + imgSrc + '"/></li>';
      layerSlides.push(slide);
    };

    // Start loading images into slides

    // Add to layer collection
    this.swipeLayers.push(layerSlides);

  };

  /**
   * Init
   *
   * Starts customization process, and leads
   * user through making a selection for each
   * layer. All layers should be added before
   * init is called.
   *
   */
  this.init = function() {

    // Setup first swipe layer, and begin.
    this.currentLayer = -1;
    this.showNextLayer();

  };

  /**
   * Show Next Layer
   *
   * Increment to next layer of customization
   *
   */
  this.showNextLayer = function() {

    this.currentLayer++;

    console.log('showNextLayer', this.swipeLayers.length);

    // TODO - save previous layer and continue displaying.

    // Destory previous swipeshow
    $(this.containerDiv).unswipeshow();

    // Clear any previous slides
    $(this.slidesHTML).find('.slide').remove();

    // Load new slides
    var lSlides = this.swipeLayers[this.currentLayer];
    for (var i = 0; i < lSlides.length; i++) {
      $(this.containerDiv).children('.slides').append(lSlides[i]);
    };

    // Re-initialize swipeshow
    $(this.containerDiv).swipeshow(this.swipeshowOptions);

  };

};

/* Expected Swipeshow format (for notes only)

  //html
  <div class="my-gallery swipeshow">
    <ul class="slides">
      <li class="slide"> ... </li>
      <li class="slide"> ... </li>
      <li class="slide"> ... </li>
    </ul>
  </div>

  //css
  .my-gallery {
    width: 200px;
    height: 200px;
  }

  //JS
  $(".my-gallery").swipeshow();

*/
