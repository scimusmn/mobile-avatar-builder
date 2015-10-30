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

  this.slideWidth = _options.slideWidth || $(window).width();
  this.slideHeight = _options.slideHeight || $(window).height();

  this.swipeshowOptions = {autostart: false, initial: 0};

  // Track all customizeable layers
  this.swipeLayers = [];
  this.currentLayer = -1;

  // Where we track the user's selections
  this.selections = [];

  // Set up container div for swipeshow.
  this.containerDiv = _containerDiv;
  $(this.containerDiv).addClass('swipeshow');
  $(this.containerDiv).css('width', this.slideWidth);
  $(this.containerDiv).css('height', this.slideHeight);

  $(this.containerDiv).append('<ul class="slides"></ul>');
  this.slides = $(this.containerDiv).children('.slides');

  // Set up confirm button
  if ('confirmBtn' in _options) {
    this.confirmBtn = _options.confirmButton;
  } else {
    // Create default confirm button (for testing only. should be passed in)
    this.confirmBtn = $('<button style="position:absolute;z-index:10;bottom:15%;left:45%;">Confirm</button>');
    $(this.containerDiv).parent().prepend(this.confirmBtn);
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
  this.addLayer = function(_imgArray) {

    var layerSlides = [];

    // Create as many slides as assets
    for (var i = 0; i < _imgArray.length; i++) {

      var imgSrc = _imgArray[i];
      var slide = '<li class="slide" ><img style="display:block; margin:auto;" width=' + this.slideWidth + ' src="' + imgSrc + '"/></li>';

      layerSlides.push(slide);
    };

    // TODO - Start pre-loading images?

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
   * Save Selection
   *
   * Increment to next step/layer of customization
   *
   */
  this.saveSelection = function() {

    // Save current layer
    var selectedIndex = this.swipeshow.cycler.current;
    this.selections[this.currentLayer] = selectedIndex;

    // Clone image outside of swipeshow.
    var clonedImg = $(this.slides).find('.slide.active img').clone().prependTo(this.containerDiv);

    $(clonedImg).attr('id', 'layer_' + this.currentLayer);
    $(clonedImg).css('position', 'absolute');
    $(clonedImg).css('pointer-events', 'none');

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

    // Destory previous swipeshow
    $(this.containerDiv).unswipeshow();

    // Clear any previous slides
    $(this.slides).find('.slide').remove();

    // Ensure there is another layer to progress to...
    if (this.currentLayer === this.swipeLayers.length) {

      this.endSelectionPhase();

      return;

    }

    // Load new slides
    var lSlides = this.swipeLayers[this.currentLayer];
    for (var i = 0; i < lSlides.length; i++) {
      $(this.slides).append(lSlides[i]);
    };

    // Re-initialize swipeshow
    this.swipeshow = $(this.containerDiv).swipeshow(this.swipeshowOptions);

  };

  /**
   * Toggle Confirm Button
   *
   * Show/Hide confirm button with animation
   *
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
   *
   */
  this.endSelectionPhase = function() {

    // TODO - permanently hide confirm button, or change to submit?
    console.log('Creation finished!');
    console.log(this.selections);

  };

};

