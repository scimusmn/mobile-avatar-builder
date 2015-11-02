/**
 * AvatarSwiper
 *
 * Use layers of assets to quickly create
 * a personalized avatar. Requires jquery
 * and swipeshow.js.
 *
 */

var AvatarSwiper = function(_containerDiv, _options) {

  this.containerDiv = _containerDiv;

  // Options and defaults
  if (typeof _options === 'undefined') _options = {};

  this.slideWidth = _options.slideWidth || $(window).width();
  this.slideHeight = _options.slideHeight || $(window).height();

  this.onSwitchLayer = _options.onSwitchLayer || function() {};

  this.onComplete = _options.onComplete || function() {};

  // Default swipeshow options
  this.swipeshowOptions = {autostart: false, initial: 0};

  // Track all customizeable layers
  this.layers = [];
  this.currentLayer = -1;

  // Where we track the user's selections
  this.selections = {};

  // Set up container div for swipeshow.
  $(this.containerDiv).addClass('swipeshow');
  $(this.containerDiv).css('width', this.slideWidth);
  $(this.containerDiv).css('height', this.slideHeight);

  $(this.containerDiv).append('<ul class="slides"></ul>');
  this.slides = $(this.containerDiv).children('.slides');

  this.confirmBtn = _options.confirmBtn || $('#confirmBtn');

  if ($.isEmptyObject(this.confirmBtn)) {
    console.log('AvatarSwiper.js: No confirm button found.\nPass in jquery object through options, or designate id of "confirmBtn"');
  }

  var _this = this;
  $(this.confirmBtn).on('click', function(e) {
    _this.saveSelection();
  });

  // Show/Hide confirm button based on inactivity
  this.confirmTimer = setInterval(function() {

    // Check slides container for grabbed or gliding class
    // If neither are there, it means it is snapped into place.
    if ($(_this.slides).hasClass('grabbed') || $(_this.slides).hasClass('gliding')) {

      _this.toggleConfirm(false);

    } else {

      _this.toggleConfirm(true);

    }

  }, 96);

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
  this.addLayer = function(_id, _imgArray, _zIndex) {

    var layer = {};
    var layerSlides = [];

    layer.id = _id;
    layer.zIndex = _zIndex || 0;

    // Create as many slides as assets
    for (var i = 0; i < _imgArray.length; i++) {

      var imgSrc = _imgArray[i];
      var slide = '<li class="slide"><img style="display:block; margin:auto;" width=' + this.slideWidth + ' src="' + imgSrc + '"/></li>';
      layerSlides.push(slide);

    };

    layer.slides = layerSlides;

    // Add to layer collection
    this.layers.push(layer);

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
   * Save Selection
   *
   * Increment to next step/layer of customization
   */
  this.saveSelection = function() {

    // Save current layer
    var selectedIndex = this.swipeshow.cycler.current;
    this.selections[this.layers[this.currentLayer].id] = selectedIndex;

    // Clone image outside of swipeshow.
    var clonedImg = $(this.slides).find('.slide.active img').clone().prependTo(this.containerDiv);

    $(clonedImg).attr('id', 'layer_' + this.currentLayer);
    $(clonedImg).css('position', 'absolute');
    $(clonedImg).css('pointer-events', 'none');
    $(clonedImg).css('z-index', this.layers[this.currentLayer].zIndex);

    this.showNextLayer();

  };

  /**
   * Show Next Layer
   *
   * Increment to next layer of customization
   */
  this.showNextLayer = function() {

    this.currentLayer++;

    // Destory previous swipeshow
    $(this.containerDiv).unswipeshow();

    // Clear any previous slides
    $(this.slides).find('.slide').remove();

    // Ensure there is another layer to progress to...
    if (this.currentLayer === this.layers.length) {

      this.endSelectionPhase();

      return;

    }

    // Trigger callback (useful for external UI)
    this.onSwitchLayer(this.layers[this.currentLayer].id);

    // Load new slides
    var lSlides = this.layers[this.currentLayer].slides;
    for (var i = 0; i < lSlides.length; i++) {
      $(this.slides).append(lSlides[i]);
    };

    // Re-initialize swipeshow
    this.swipeshow = $(this.containerDiv).swipeshow(this.swipeshowOptions);

    // Set z-index of current interactive layer.
    $(this.slides).css('z-index', this.layers[this.currentLayer].zIndex);

    // Override swipeshow's default behavior of hiding other slides.
    $(this.containerDiv).css('overflow', 'visible');

  };

  /**
   * Toggle Confirm Button
   *
   * Show/Hide confirm button with animation
   */
  this.toggleConfirm = function(_show) {

    if (_show) {
      $(this.confirmBtn).show();
    } else {
      $(this.confirmBtn).hide();
    }

  };

  /**
   * End selection phase
   */
  this.endSelectionPhase = function() {

    // Hide confirm button
    this.toggleConfirm(false);
    clearInterval(this.confirmTimer);

    this.onComplete(this.selections);

  };

};

