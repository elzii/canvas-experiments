CanvasRenderingContext2D.prototype.clear = 
  CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
    if (preserveTransform) {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (preserveTransform) {
      this.restore();
    }         
};



(function($) {

  var canvas    = $('#canvas');
  var ctx       = canvas.get(0).getContext('2d');
  var container = $(canvas).parent();
  

  //Run function when browser resizes
  $(window).resize( draw );


  function draw() { 
    canvas.attr('width', $(container).width() );
    canvas.attr('height', $(container).height() );

    var WIDTH  = canvas.width();
    var HEIGHT = canvas.height();

    var WIDTH_HALF  = canvas.width() / 2,
        HEIGHT_HALF = canvas.height() / 2
    
    console.log('WIDTH, HEIGHT', WIDTH, HEIGHT)

    drawOverlay()
    drawBottomBoundingBox()
    drawTopBoundingBox()

  }



  function drawOverlay( options ) {

    // var coord = findCoordFromAngle({
    //   startX: __X(0.45),
    //   startY: __Y(0.50),
    //   angle: 105,
    //   distance: 100
    // })

    ctx.save();
    ctx.beginPath();      
    ctx.moveTo( 0, 0 )
    ctx.lineTo(__X(0.60), 0 )
    ctx.lineTo( __X(0.45), __Y(1.0) )
    ctx.lineTo(0, __Y(1.0) )
    ctx.lineTo(0, 0)
    ctx.closePath();
    
    ctx.fillStyle = "rgba(59,58,54,0.70)";
    ctx.fill();
    ctx.restore();

  }


  function drawBottomBoundingBox( options ) {

    var options  = options || {};
    var distance = options.distance ? options.distance : 60;

    var angleBottom = getAngle( { x: __X(0.45), y: __Y(1.0) }, { x: __X(0.60), y: 0 } )

    var coord = findCoordFromAngle({
      startX: __X(0.45),
      startY: __Y(1.0),
      angle: angleBottom,
      distance: distance
    })

    // console.log('angleBottom, coord', angleBottom, coord)


    ctx.save()
    ctx.beginPath()
    ctx.moveTo( __X(1.0), __Y(1.0) )
    ctx.lineTo( __X(0.45), __Y(1.0) )
    ctx.lineTo( coord.x, coord.y )
    ctx.lineTo( __X(1.0), coord.y )

    // ctx.strokeStyle="#FF0000";
    // ctx.stroke()

    ctx.closePath()
    ctx.fillStyle = "white"
    // ctx.fillStyle = "rgba(255,0,0, 0.5)"
    ctx.fill();
    ctx.restore()     

  }



  function drawTopBoundingBox( options ) {

    var options  = options || {};
    var distance = options.distance ? options.distance : 60;

    var angleTop = getAngle( { x: __X(0.60), y: 0 }, { x: __X(0.45), y: __Y(1.0) } )

    var coord = findCoordFromAngle({
      startX: __X(0.60),
      startY: __Y(0),
      angle: angleTop,
      distance: distance
    })

    // console.log('angleTop, coord', angleTop, coord)

    ctx.save()
    ctx.beginPath()
    ctx.moveTo( __X(0.60), __Y(0) )
    ctx.lineTo( coord.x, coord.y )
    ctx.lineTo( __X(1.0), coord.y )
    ctx.lineTo( __X(1.0), 0 )

    // ctx.strokeStyle="red";
    // ctx.stroke();

    ctx.closePath()
    ctx.fillStyle = "white"
    ctx.fill();
    ctx.restore()     

  }




  //Initial call 
  // draw();





  



  function updateParallaxCard( options ) {

    var options = options || {};

    var $el = options.$el ? options.$el : {};

    if ( $el.is(':in-viewport')) {
      requestAnimationFrame(function() {
        var scrollTop  = window.pageYOffset || $win.scrollTop();
        var viewHeight = $(window).height()
        var pageY      = viewHeight + scrollTop;
        var elOffset   = $el.offset().top;
        var elHeight   = $el.height()
        var elScrollYPercent = (pageY-elOffset) / elHeight

        if ( elScrollYPercent <= 1 ) {
          // console.log( elHeight, elOffset, pageY )
          console.log( 'elScrollYPercent', elScrollYPercent )

          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

          var topBoxHeight = Math.round((1-elScrollYPercent)*60*3) < 60 ? 60 : Math.round((1-elScrollYPercent)*60*3)
          var botBoxHeight = Math.round((elScrollYPercent)*60*2) > 60 ? 60 : Math.round((1-elScrollYPercent)*60*2)


          drawOverlay()

          drawTopBoundingBox({
            distance: topBoxHeight
          })
          drawBottomBoundingBox({
            distance: botBoxHeight
          })

          if ( elScrollYPercent > 0.50 ) {
          }

          // $('#canvas-bg').css('background-position', 50 +'% '+ (elScrollYPercent/5)*100 +'%')
        }

      });
    }
  }







  /**
   * Find Coordinates from angle
   * @param  {Object} options 
   * @return {Object}         
   */
  function findCoordFromAngle( options ) {

    var startX   = options.startX ? options.startX : 0,
        startY   = options.startY ? options.startY : 0,
        angle    = options.angle ? options.angle : 45,
        distance = options.distance ? options.distance : 0;

    var result = {};

    result.x = Math.cos(angle * Math.PI / 180) * distance + startX;
    result.y = Math.sin(angle * Math.PI / 180) * distance + startY;

    return result;
  }

  /**
   * Get Angle
   * get an angle from two points [x,y]
   * 
   * @param  {Object} p1 
   * @param  {Object} p2 
   * @return {Number} 
   */
  function getAngle(p1, p2) {
    var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    return angleDeg;
  }

  /**
   * __X
   * Get canvas X coord (pixel value) from a given percentage
   * @param  {Number} percentage 
   * @return {Number}            
   */
  function __X(percentage) {
    var percentage = percentage ? percentage : 0.0;
    return canvas.width() * percentage
  }

  /**
   * __Y
   * Get canvas Y coord (pixel value) from a given percentage
   * @param  {Number} percentage 
   * @return {Number}            
   */
  function __Y(percentage) {
    var percentage = percentage ? percentage : 0.0;
    return canvas.height() * percentage
  }

  /**
   * requestAnimFrame
   * Request Animation Frame polyfill
   * 
   * @param  {Function} callback
   */
  window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
      function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();






  















  /**
   * Add Viewport Scroll Handler
   * @param {Object} options 
   * {
   *   $el: [Element],
   *   state: [Object],
   *   offsetTop: [Number],
   *   offsetBot: [Number],
   *   intro: [Function],
   *   outro: [Function],
   * }
   */
  function addViewportScrollHandler(options) {
    options = options || {};
    var $el = options.$el;
    var $win = $(window);
    var state = options.state;
    var offsetTop = options.offsetTop;
    var offsetBot = options.offsetBot;
    var intro = options.intro;
    var outro = options.outro;

    Webflow.scroll.on(function() {
      var viewTop = $win.scrollTop();
      var viewHeight = $win.height();
      var top = $el.offset().top;
      var height = $el.outerHeight();
      if (offsetTop < 1 && offsetTop > 0) offsetTop *= viewHeight;
      if (offsetBot < 1 && offsetBot > 0) offsetBot *= viewHeight;
      var active = (top + height - offsetTop >= viewTop && top + offsetBot <= viewTop + viewHeight);
      if (active === state.active) return;
      state.active = active;
      active ? intro(options) : outro(options);
    });
  }


  


  function onScroll() {

    updateParallaxCard({
      $el: $canvas_container
    })

    requestAnimationFrame(function() {
      var scrollTop = window.pageYOffset || $win.scrollTop();
    });
  
  }


  $(document)
    .on('scroll', onScroll);
    // .on('touchmove', onTouchMove)


  var $canvas_container = $('#canvas-container');
  addViewportScrollHandler({
    $el: $canvas_container,
    context: ctx,
    state: {active: false},
    offsetTop: 0.0,
    offsetBot: 0.0,
    intro: function(opts) {
      console.log('intro', opts)
    },
    outro: function() {
      console.log('outro')
    }

  })

  draw()

})(jQuery); 



