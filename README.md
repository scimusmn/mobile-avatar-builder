# mobile-avatar-builder
Create a personalized avatar with a few swipes of the thumb.


* Order of customization is determined by what order you add the customization layers
* The z index is controlled by an optional z-index value passed in with addLayer.

1) Create an avatar swiper object with callback hooks and style options.
2) Add layers with associated assets.
3) Init when you want to start the selection process.


Available options when adding layer:

// required
imgArray
// optional
yOffset, z-index