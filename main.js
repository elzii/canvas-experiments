var APP = (function ($) {


  /**
   * Modules
   */
  var app  = window.APP || {};
  var ee   = new EventEmitter();

  app.environment = function() {
    return window.location.href.match(/(localhost|dev)/g) ? 'development' : 'production';
  }

  /**
   * Settings
   */
  app.settings = {

  }
  

  /**
   * Init
   */
  app.init = function() {

    this.progressiveMedia.init()
    this.parallaxCardDefault.init()
    this.coverSlider.init()

  }


  /**
   * Cover Slider
   * 
   * @type {Object}
   */
  app.coverSlider = {

    $el: {
      container: document.getElementById('cover'),
      swiperCover: document.getElementById('swiper-cover'),
      swiperCoverContent: document.getElementById('swiper-coverContent'),
      touchOverlay: document.getElementById('swiper-touch-overlay')
    },

    init: function() {

      var _this = this;

      _this.slider()
      _this.events()

    },

    slider: function() {

      var _this = this;

      window.coverContentSwiper = $( _this.$el.swiperCoverContent ).swiper({
        direction: 'vertical',
        onInit: function(swiper) {
          

          if ( ee ) {
            ee.addListener('progressiveMedia.renderImageAsBackground', function(opts) {
              if ( opts.name === 'cover-photo' ) {
                setTimeout(function() {
                  $( swiper.slides[0] ).addClass('show')
                }, 150)
              }
            })
          } else {
            $( _this.$el.container ).find('.cover__sheet').addClass('show')
          }

        },
        onSlideChangeStart: function(swiper) {
          // console.log('onSlideChangeStart', swiper.activeIndex, swiper.previousIndex, swiper)

          $( swiper.slides[swiper.previousIndex] ).removeClass('show')
          $( swiper.slides[swiper.activeIndex] ).addClass('show')

        },
      })
      
      window.coverSwiper = $( _this.$el.swiperCover ).swiper({
        // scrollbar: '.swiper-scrollbar',
        pagination: '.swiper-pagination',
        paginationClickable: true,
        direction: 'vertical',
        keyboardControl: true,
        mousewheelControl: true,
        mousewheelSensitivity: 1,
        mousewheelReleaseOnEdges: true,

        
        iOSEdgeSwipeDetection: true,
        iOSEdgeSwipeThreshold: 20,

        // freeMode: true,
        // freeModeSticky: true,
        // freeModeMomentumRatio: 20,


        // swipeHandler: '.swipe-handler',
        // noSwiping: true,
        noSwipingClass: 'swiper-no-swiping',

        control: window.coverContentSwiper,

        onInit: function(swiper, event) {
          // console.log('onInit', swiper, event)
          _this.reveal()
        },
        onReachEnd: function(swiper, event) {
          // console.log('onReachEnd', swiper, event)
        },
        onSlideChangeStart: function() {},
        onSlideChangeEnd: function(swiper, event) {
          // console.log('onSlideChangeEnd', swiper, event)
          app.progressiveMedia.readMedia()
        },
        onSlideNextStart: function(swiper) {
          swiper.on('touchMove', function(swiper, event) {
            if ( Math.abs(swiper.getWrapperTranslate()) > swiper.height ) {}
          })
        },
        onSlideNextEnd: function(swiper, event) {
          // console.log('onSlideNextEnd', swiper, event)

          var activeIndex = swiper.activeIndex;

          if ( swiper.isEnd && !swiper.animating ) {
            var lastSlide = swiper.slides[activeIndex]


            $(document).on('scroll', function() {
              window.coverSwiper.disableMousewheelControl()
            })
            

            $( lastSlide ).addClass('swiper-no-swiping')
          }
        },
        onSlidePrevStart: function() {},
        onSlidePrevEnd: function() {},
        onTouchMove: function(swiper, event) {
          // console.log('onTouchMove', Math.abs(swiper.getWrapperTranslate()), swiper.height )
        }
      });

    },

    events: function() {

      var _this = this;

      var lastScrollTime;
      
      var s = new ScrollProxy() 
      
      s.on('scroll', function() {
        var scrollTop = window.pageYOffset || $(window).scrollTop()

        if ( scrollTop == 0 ) {
          // $( _this.$el.touchOverlay ).hide()
          $('.swiper-no-swiping').removeClass('swiper-no-swiping')
        }
      })

      
      var lastScrollTime;

      // bindMouseWheelHandler({
      //   handler: function(e) {
      //     // console.log('bindMouseWheelHandler', e)
      //     if ( e.pageYOffset == 0 ) {
      //       if ( (new window.Date()).getTime() - lastScrollTime > 50 ) {
      //         window.coverSwiper.enableMousewheelControl()
      //       }
      //     }
      //     lastScrollTime = (new window.Date()).getTime();
      //   }
      // })


      bindScrollHandler({
        handler: function(e) {
          if ( e.scrollTop == 0 ) {
            window.coverSwiper.enableMousewheelControl()
          }
        }
      })

    },

    reveal: function() {
      var _this = this;

      // show when event has been emitted, otherwise show immediatly
      if ( ee ) {
        ee.addListener('progressiveMedia.renderImageAsBackground', function(opts) {
          if ( opts.name === 'cover-photo' ) {
            $( _this.$el.container ).find('.cover__sheet').addClass('show')
          }
        })
      } else {
        $( _this.$el.container ).find('.cover__sheet').addClass('show')
      }
    }

  }















  /**
   * Parallax Card - Default
   * 
   * @type {Object}
   */
  app.parallaxCardDefault = {

    debug: false,


    $el: {
      container: document.getElementById('canvas-container'),
      canvas: document.getElementById('canvas'),
      context: this.canvas.getContext('2d')
    },


    // Init
    init: function() {
      var _this = this;

      // console.log( '_this.$el', _this.$el )

      // set canvas size to container size
      _this.setCanvasSize()

      _this.update({
        $el: $( _this.$el.container ),
      })

      _this.events()
    },

    setCanvasSize: function() {
      var _this = this;

      $(_this.$el.canvas).attr('width', $(_this.$el.container).width() )
      $(_this.$el.canvas).attr('height', $(_this.$el.container).height() )
    },

    // Events
    events: function() {
      var _this = this;

      $(document).on('scroll', function() {
        _this.update()
      })

      $(window).resize(function() {
        _this.setCanvasSize()
        _this.update()
      });


      addViewportScrollHandler({
        $el: $( _this.$el.container ),
        context: _this.$el.context,
        state: {active: false},
        offsetTop: 0.0,
        offsetBot: 0.0,
        intro: function(opts) {
          // console.log('intro', opts)
        },
        outro: function() {
          // console.log('outro', opts)
        }

      })

    },


    // Draw
    // draw: function() {
    //   var _this = this;

    //   _this.drawOverlay()
    //   _this.drawBottomBoundingBox()
    //   _this.drawTopBoundingBox()
    // },


    // Draw Overlay
    drawOverlay: function( options ) {

      var _this = this,
          c     = _this.$el.canvas,
          ctx   = _this.$el.context;

      ctx.save();
      ctx.beginPath();      
      ctx.moveTo( 0, 0 )
      ctx.lineTo( __X(c, 0.60), 0 )
      ctx.lineTo( __X(c, 0.45), __Y(c, 1.0) )
      ctx.lineTo(0, __Y(c, 1.0) )
      ctx.lineTo(0, 0)
      ctx.closePath();
      
      ctx.fillStyle = "rgba(59,58,54,0.70)";
      ctx.fill();
      ctx.restore();

    },

    // Draw Bottom Bounding Box
    drawBottomBoundingBox: function( options ) {

      var _this = this,
          c     = _this.$el.canvas,
          ctx   = _this.$el.context;

      var options  = options || {};
      var distance = options.distance ? options.distance : 60;

      var angleBottom = getAngle( { x: __X(c, 0.45), y: __Y(c, 1.0) }, { x: __X(c, 0.60), y: 0 } )

      var coord = findCoordFromAngle({
        startX: __X(c, 0.45),
        startY: __Y(c, 1.0),
        angle: angleBottom,
        distance: distance
      })


      ctx.save()
      ctx.beginPath()
      ctx.moveTo( __X(c, 1.0), __Y(c, 1.0) )
      ctx.lineTo( __X(c, 0.45), __Y(c, 1.0) )
      ctx.lineTo( coord.x, coord.y )
      ctx.lineTo( __X(c, 1.0), coord.y )

      // ctx.strokeStyle="#FF0000";
      // ctx.stroke()

      ctx.closePath()

      ctx.translate(canvas.width / 2, canvas.height / 2);

      ctx.fillStyle = "white"
      // ctx.fillStyle = "rgba(255,0,0, 0.5)"
      ctx.fill();
      ctx.restore()     

    },

    // Draw Top Bounding Box
    drawTopBoundingBox: function ( options ) {

      var _this = this,
          c     = _this.$el.canvas,
          ctx   = _this.$el.context;

      var options  = options || {};
      var distance = options.distance ? options.distance : 60;

      var angleTop = getAngle( { x: __X(c, 0.60), y: 0 }, { x: __X(c, 0.45), y: __Y(c, 1.0) } )

      var coord = findCoordFromAngle({
        startX: __X(c, 0.60),
        startY: __Y(c, 0),
        angle: angleTop,
        distance: distance
      })

      // console.log('angleTop, coord', angleTop, coord)

      ctx.save()
      ctx.beginPath()
      ctx.moveTo( __X(c, 0.60), __Y(c, 0) )
      ctx.lineTo( coord.x, coord.y )
      ctx.lineTo( __X(c, 1.0), coord.y )
      ctx.lineTo( __X(c, 1.0), 0 )

      // ctx.strokeStyle="red";
      // ctx.stroke();

      ctx.closePath()
      ctx.fillStyle = "white"
      ctx.fill();
      ctx.restore()     

    },


    update: function( options ) {

      var _this = this;

      var options       = options || {};
      var $el           = options.$el ? options.$el : $( _this.$el.container );
      var offsetPercent = options.offsetPercent ? options.offsetPercent : 0;

      if ( $el.is(':in-viewport') ) {
        requestAnimFrame(function() {

          var data = getElementScrollData({ $el: $el, offsetPercent: offsetPercent, debug: _this.debug })

          _this.clear()

          var topBoxH = Math.round(Math.max( (1-(data.scrollRatio*1.1))*60*3, 60 ));
          var botBoxH = Math.round(Math.max( ((data.scrollRatio*1.1))*60*3, 60 ));

          _this.drawOverlay()
          _this.drawTopBoundingBox({ distance: topBoxH })
          _this.drawBottomBoundingBox({ distance: botBoxH })

          if ( data.elScrollYPercent > 0.50 ) {}

          // $('#canvas-bg').css('background-position', 50 +'% '+ (elScrollYPercent/3)*100 +'%')

        });
      }
    },


    clear: function() {
      var _this = this;
      _this.$el.context.clearRect(0, 0, _this.$el.context.canvas.width, _this.$el.context.canvas.height);
    }




  }

















  /**
   * Progressive Media
   */
  app.progressiveMedia = {

    init: function() {

      var _this = app.progressiveMedia;

      _this.events()
      _this.readMedia()
    },

    events: function() {
      var _this = this;

      bindScrollHandler({
        $el: $('[data-progressivemedia]'),
        handler: function(data) {
          
          if ( data.$el.is(':in-viewport') ) {
            _this.readMedia()
          }
        }
      })
    },

    readMedia: function() {
      this.readThumbs()
      this.readFull()
    },

    readFull: function() {

      var _this = app.progressiveMedia;
      
      var $items = $('[data-progressivemedia]')

      $.each( $items, function(i, item) {

        var hasBg = ($(item).css('background-image') != 'none') ? true : false;

        if ( hasBg ) {
          return;
        }
        
        var type         = $(item).data('progressivemedia-type'),
            src          = $(item).data('progressivemedia-src'),
            viewportOnly = $(item).data('progressivemedia-viewport-only'),
            name         = $(item).data('progressivemedia-name');

        if ( viewportOnly ) {
          if ( $(item).is(':in-viewport') ) {
          
            if ( type === 'background' ) {
              _this.renderImageAsBackground({
                element: $(item),
                name: name,
                src: src,
              })
            }
          }
        } else {
          _this.renderImageAsBackground({
            element: $(item),
            name: name,
            src: src,
          })
        }
        
      })

    },


    readThumbs: function() {

      var _this = app.progressiveMedia;
      
      var $items = $('[data-progressivemedia-thumb]')

      $.each( $items, function(i, item) {

        if ( $(item).siblings('canvas').length > 0 ) {
          return;
        }
        
        var src     = $(item).attr('src')
        var radius  = $(item).data('progressivemedia-radius') ? $(item).data('progressivemedia-radius') : 20;
        var id      = 'progressiveMedia-preview-canvas-'+makeId();
        var canvas  = $('<canvas/>', { id: id, class: 'progressiveMedia-preview-canvas' })
        var context = canvas.get(0).getContext('2d')

        $(item).before(canvas)

        _this.drawImagePreviewToCanvas({
          id: id,
          src: src,
          radius: radius,
          context: context
        })

      })

    },

    renderImageAsBackground: function(options, callback) {

      var src     = options.src ? options.src : '';
      var name    = options.name ? options.name : '';
      var $element = options.element ? options.element : {};

      var img = new Image();
      img.src = src;
      img.onload = function () {

        $element.css('background-image', 'url('+src+')')
        
        setTimeout(function() {
          $element.find('canvas').fadeOut()
          ee.emitEvent('progressiveMedia.renderImageAsBackground', [options]);
          if ( callback ) callback()
        }, 100)
      }

    },


    drawImagePreviewToCanvas: function(options, callback) {

      var id      = options.id ? options.id : '';
      var src     = options.src ? options.src : '';
      var radius  = options.radius ? options.radius : '';
      var context = options.context ? options.context : {};

      var w = context.canvas.width;
      var h = context.canvas.height;

      var img = new Image();
      img.src = src;
      img.onload = function () {
        context.drawImage(img, 0, 0, w, h);
        stackBlurCanvasRGBA(id, 0, 0, w, h, radius);
      }
    },



  }








  



  function getElementScrollData( options ) {

    var options       = options || {};
    var $el           = options.$el ? options.$el : {};
    var debug         = options.debug ? options.debug : false;
    var offsetPercent = options.offsetPercent ? options.offsetPercent : 0;


    if ( $el ) {
      var scrollTop              = window.pageYOffset || $win.scrollTop();
      var viewHeight             = $(window).height()
      var pageY                  = viewHeight + scrollTop;
      var offset                 = offsetPercent ? Math.round($el.height() * offsetPercent) : 0;
      var elTop                  = $el.offset().top;
      var elHeight               = $el.height()
      var elScrollYPercent       = (pageY-elTop) / elHeight
      var pastOffset             = (pageY-elTop > offset) ? true : false;
      var elOffsetScrollY        = ((pageY-elTop) - offset) > 0 ? ((pageY-elTop) - offset) : 0;
      var elOffsetScrollYPercent = elOffsetScrollY / elHeight;
      var scrollRatio            = Math.max(Math.min( scrollTop / (((elTop + (elHeight / 2)) - (viewHeight / 2)) * 2), 1), 0);

      
      if ( debug ) {
        console.table({
          scrollTop: [scrollTop], 
          viewHeight: [viewHeight], 
          pageY: [pageY], 
          elTop: [elTop], 
          elHeight: [elHeight], 
          offsetPercent: [offsetPercent], 
          offset: [offset], 
          elOffsetScrollY: [elOffsetScrollY],
          scrollRatio: [scrollRatio], 
          elScrollYPercent: [elScrollYPercent],
          elOffsetScrollYPercent: [elOffsetScrollYPercent],
          pastOffset: [pastOffset],
        })
      }
      
      return {
        scrollTop: scrollTop,
        viewHeight: viewHeight,
        pageY: pageY,
        elTop: elTop,
        elHeight: elHeight,
        elScrollYPercent: elScrollYPercent,
        pastOffset: pastOffset,
        elOffsetScrollY: elOffsetScrollY,
        elOffsetScrollYPercent: elOffsetScrollYPercent,
        scrollRatio: scrollRatio,
      }

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
  function __X(canvas, percentage) {
    var percentage = percentage ? percentage : 0.0;
    return $( canvas ).width() * percentage
  }

  /**
   * __Y
   * Get canvas Y coord (pixel value) from a given percentage
   * @param  {Number} percentage 
   * @return {Number}            
   */
  function __Y(canvas, percentage) {
    var percentage = percentage ? percentage : 0.0;
    return $( canvas ).height() * percentage
  }

  /**
   * requestAnimFrame
   * Request Animation Frame polyfill
   * 
   * @param  {Function} callback
   */
  window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
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



  /**
   * Bind Scroll Handler
   * 
   * @param  {Object} options 
   * @return {Function}
   */
  function bindScrollHandler(options) {
    options = options || {};
    var $el = options.$el;
    var $win = $(window);
    var handler = options.handler;

    if ( $el ) {
      Webflow.scroll.on(function() {
        requestAnimFrame(function() {
          var data = getElementScrollData({ $el: $el });
              data.$el = $el;

          handler( data )
        })
      })
    } else {
      Webflow.scroll.on(function() {
        requestAnimFrame(function() {
          handler({
            scrollTop: window.pageYOffset || $(window).scrollTop(),
            viewHeight: $(window).height(),
            pageY: (window.pageYOffset || $(window).scrollTop()) + $(window).height()
          })
        })
      })

      // $(document).on('scroll', function() {
      //   requestAnimFrame(function() {
      //     handler({
      //       scrollTop: window.pageYOffset || $(window).scrollTop(),
      //       viewHeight: $(window).height(),
      //       pageY: (window.pageYOffset || $(window).scrollTop()) + $(window).height()
      //     })
      //   })
      // })
    }
  }



  function bindMouseWheelHandler(options) {
    options = options || {};
    var $el = options.$el;
    var $win = $(window);
    var handler = options.handler;

    var lastPageYOffset,
        lastScrollTime;

    $(document).on('mousewheel DOMMouseScroll', function(event) {
      var pageYOffset = window.pageYOffset || $win.scrollTop()

      if ( pageYOffset > lastPageYOffset ) {
        handler({
          lastPageYOffset: lastPageYOffset,
          pageYOffset: pageYOffset,
          direction: 'down'
        })
      } else {
        handler({
          lastPageYOffset: lastPageYOffset,
          pageYOffset: pageYOffset,
          direction: 'up'
        })
      }

      lastPageYOffset = pageYOffset;
      lastScrollTime = (new window.Date()).getTime()
    })
  }





  function makeId(length) {

    var length = length ? length : 5;

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  


  function onScroll() {

    
  }
  function onTouchMove() {

    
  }


  $(document)
    .on('scroll', onScroll)
    .on('touchmove', onTouchMove)




  /**
   *
   * 
   * ----------------------------------------------------------------
   * Event Listeners
   * ----------------------------------------------------------------
   *
   * 
   */



  document.addEventListener('DOMContentLoaded', function (event) {
    console.log('document.DOMContentLoaded')
  })


  window.addEventListener('load', function (event) {
    console.log('window.load')
  })




  app.init()
  
  return app;

})(jQuery); 



