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
  this.overlap = _options.overlap || 0;
  this.onSwitchLayer = _options.onSwitchLayer || function() {};
  this.onComplete = _options.onComplete || function() {};
  this.confirmBtn = _options.confirmBtn || $('#confirmBtn');

  // Default swipeshow options
  this.swipeshowOptions = {autostart: false, initial: 0};

  // Store customizeable layers
  this.layers = [];
  this.currentLayer = -1;

  // Store user's selections
  this.selections = {};

  // Ready container div for swipeshow.
  $(this.containerDiv).addClass('swipeshow');
  $(this.containerDiv).css('width', this.slideWidth);
  $(this.containerDiv).css('height', this.slideHeight);
  $(this.containerDiv).append('<ul class="slides"></ul>');
  this.slides = $(this.containerDiv).children('.slides');


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

    var imgWidth = this.slideWidth + this.overlap;

    // Create as many slides as assets
    for (var i = 0; i < _imgArray.length; i++) {

      var imgSrc = _imgArray[i];
      var slide = '<li class="slide"><img style="display:block; margin:auto; position:absolute; left: 50%; top: 50%; -webkit-transform: translateY(-50%) translateX(-50%);" width=' + imgWidth + ' src="' + imgSrc + '"/></li>';

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

    // Set up confirm button
    this.setupConfirmBtn();

    // Setup first swipe layer, and begin.
    this.currentLayer = -1;
    this.showNextLayer();

  };

  /**
   * Setup confirm button
   *
   * Show and hide confirm button
   * based on swipe activity
   *
   */
  this.setupConfirmBtn = function() {

    if ($.isEmptyObject(this.confirmBtn)) console.log('AvatarSwiper.js: No confirm button found.\nPass in jquery object through options, or designate id of "confirmBtn"');

    $(this.confirmBtn).show();

    var _this = this;
    $(this.confirmBtn).on('click', function(e) {

      _this.saveSelection();

    });

    this.confirmTimer = setInterval(function() {

      if ($(_this.slides).hasClass('grabbed') || $(_this.slides).hasClass('gliding')) {

        $(_this.confirmBtn).removeClass('enabled');
        $(_this.confirmBtn).addClass('disabled');

      } else {

        $(_this.confirmBtn).addClass('enabled');
        $(_this.confirmBtn).removeClass('disabled');

      }

    }, 30);

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

    // Hide
    $(this.slides).hide();

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

    // Fade new layer in ...
    $(this.slides).fadeIn(400);

  };

  /**
   * End selection phase
   */
  this.endSelectionPhase = function() {

    // Hide confirm button
    $(this.confirmBtn).hide();
    clearInterval(this.confirmTimer);

    // Trigger completion callback with final selections
    this.onComplete(this.selections);

  };

};

