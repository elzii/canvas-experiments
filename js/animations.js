$(document).ready(function() {
  var $win = $(window);
  var cardParallaxDegrees = 10;
  var notchTextTemplate = '<div style="padding: 2px 13px;">0%</div>';
  var timelineInterval;
  var windowWidth = $win.width();
  var windowHeight = $win.height();

  var $sectionTwo = $('.section-two');
  var $sectionThree = $('.section-three');
  var $imageGridWrapper = $('.imggridwrap');
  var $timelineNotch = $('.timeline-carrot');
  var $timelineNumber = $('.timeline-carrot-number');
  var $actionGroups = $('.item-group');

  var parallaxScales = {
    card1: 100,
    card2: 60,
    card3: 60,
    card4: 60,
    card5: 60,
    card6: 60,
    card7: 30,
    card8: 30,
    card9: 30,
    card10: 30,
  };

  // notches
  var $notchScroll = $('.bounding-box-scroll-x');
  var $notchScrollCarrot = $notchScroll.children('.action-list-carrot');
  var $notchScrollText = $(notchTextTemplate).appendTo($notchScroll);
  var $notchScrollContent = $notchScrollText.add($notchScrollCarrot);

  var $notchMouseX = $('.bounding-box-mouse-x');
  var $notchMouseXText = $(notchTextTemplate).appendTo($notchMouseX);
  var $notchMouseXCarrot = $notchMouseX.children('.action-list-carrot');
  var $notchMouseXContent = $notchMouseXText.add($notchMouseXCarrot);

  var $notchMouseY = $('.bounding-box-mouse-y');
  var $notchMouseYCarrot = $notchMouseY.children('.action-list-carrot');
  var $notchMouseYText = $(notchTextTemplate).appendTo($notchMouseY);
  var $notchMouseYContent = $notchMouseYText.add($notchMouseYCarrot);

  var allNotches = $notchScrollContent
    .add($notchMouseXContent)
    .add($notchMouseYContent);

  allNotches.css({
    position: 'absolute',
    width: 44,
    height: 24,
    color: '#272727',
    fontSize: 11,
    textAlign: 'right'
  });

  // scroll parallax
  var sectionTwoTop = $sectionTwo.offset().top;
  var sectionTwoHeight = $sectionTwo.height();

  var cards = {};
  for (var i = 1; i <= 10; i++) {
    var $card = $(i === 1 ? '.parallax-card.scroll' : ('.card-' + i)); 
    cards[i] = $card;

    // Perf improvements
    $card.css('will-change', 'transform');
  }

  // mouse parallax
  var parallaxCardMouse = $('.parallax-card.mouse');
  var cardMouseTop = $('.card-mouse-top');
  var weeBitsA = $('.wee-bits-a');
  var weeBitsB = $('.wee-bits-b');

  // events
  var clientX = $win.width() / 2;
  var clientY = $win.height() / 2;
  
  function onMouseMove(e) {
    if (!$sectionThree.is(':in-viewport')) { return; }

    if (typeof e.clientX === 'number') {
      clientX = e.clientX;
    }
    if (typeof e.clientY === 'number') {
      clientY = e.clientY;
    }

    updateMouseElements();
  }

  function onTouchMove(e) {
    var event = e.originalEvent;
    var touch = event && event.targetTouches && event.targetTouches[0];
    if (touch) {
      clientX = touch.clientX;
      updateMouseElementsIfVisible();
    }
  }

  function onScroll(e) {
    updateParallaxCardsIfVisible();
    updateMouseElementsIfVisible();
  }

  function onResize(e) {
    windowWidth = $win.width();
    windowHeight = $win.height();

    updateParallaxCardsIfVisible();
    updateMouseElementsIfVisible();
  } 

  function updateMouseElementsIfVisible() {
    if ($sectionThree.is(':in-viewport')) {
      updateMouseElements();
    }
  }

  function updateMouseElements() {
    var scrollTop = $win.scrollTop();
    var scrollLeft = $win.scrollLeft();

    // notches
    var parallaxCardMouseCenterLeft = (parallaxCardMouse.offset().left + (parallaxCardMouse.width() / 2)) - scrollLeft;
    var parallaxCardMouseCenterTop = (parallaxCardMouse.offset().top + (parallaxCardMouse.height() / 2)) - scrollTop;

    var mouseXRatio = (clientX - parallaxCardMouseCenterLeft) /
      ((clientX < parallaxCardMouseCenterLeft) ? (parallaxCardMouseCenterLeft) : (windowWidth - parallaxCardMouseCenterLeft));
    var mouseX = Math.floor(((mouseXRatio + 1) / 2) * 100) + '%';
    var mouseYRatio = (clientY - parallaxCardMouseCenterTop) /
      ((clientY < parallaxCardMouseCenterTop) ? (parallaxCardMouseCenterTop) : (windowHeight - parallaxCardMouseCenterTop));
    var mouseY = Math.floor(((mouseYRatio + 1) / 2) * 100) + '%';

    requestAnimationFrame(function() {
      $notchMouseXContent.css('top', mouseX);
      $notchMouseXText.text(mouseX);
      $notchMouseYContent.css('top', mouseY);
      $notchMouseYText.text(mouseY);

      // cards parallax
      parallaxCardMouse.parent().css('perspective', '2000px');

      parallaxCardMouse
        .css('transform', 'translate3d(0, 0, 0) rotateX(' + (-mouseYRatio * cardParallaxDegrees) + 'deg) rotateY(' + (mouseXRatio * cardParallaxDegrees) + 'deg)')
        .css('perspective', '2000px');

      cardMouseTop.css('transform', 'translate3d(0, 0, 0) rotateX(' + (-mouseYRatio * cardParallaxDegrees) + 'deg) rotateY(' + (mouseXRatio * cardParallaxDegrees) + 'deg) translateZ(100px)')

      weeBitsA.css({
        marginLeft: mouseXRatio * 15,
        marginTop: mouseYRatio * 15
      });

      weeBitsB.css({
        marginLeft: mouseXRatio * 35,
        marginTop: mouseYRatio * 35
      });
    });
  }

  function translateCard(card, yPercent) {
    card.css('transform', 'translate3d(0,' + yPercent + '%,0)');
  }

  function updateParallaxCardsIfVisible() {
    if ($sectionTwo.is(':in-viewport')) { 
      updateParallaxCards();
    }
  }

  function updateParallaxCards() {
    requestAnimationFrame(function() {
      var scrollTop = window.pageYOffset || $win.scrollTop();
      var scrollRatio = Math.max(Math.min(
        scrollTop / (((sectionTwoTop + (sectionTwoHeight / 2)) - (windowHeight / 2)) * 2)
       , 1), 0);
      var scrollOffsetRatio = -scrollRatio + 0.5;
      var scrollX = Math.floor(scrollRatio * 100) + '%';

      // notches
      $notchScrollContent.css('top', scrollX);
      $notchScrollText.text(scrollX);

      // scroll parallax
      for (var i = 1; i <= 10; i++) {
        translateCard(cards[i], scrollOffsetRatio * parallaxScales['card' + i]);
      }
    });
  }

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
      active ? intro() : outro();
    });
  }

  function setNotchTime(time, activeGroup, step) {
    $timelineNumber.text(time); 

    $('.active-group').removeClass('active-group');
    activeGroup && $('#action-group-' + activeGroup).addClass('active-group');

    step && step.next();
  }

  function rewindPlayhead(step) {
    var timelineTime = 7.00;
    var parentOffset = $timelineNotch.parent().get(0).getBoundingClientRect();

    timelineInterval = window.setInterval(function() {
      requestAnimationFrame(function() {
        var topOffset = $timelineNotch.get(0).getBoundingClientRect().top;
        var timelineTime = (topOffset - parentOffset.top) / 288 * 7.0; 

        if (timelineTime < 0.2) {
          timelineTime = 0.0;
        }

        setNotchTime(timelineTime.toFixed(2));
      });
    }, 5);

    step && step.next();
  }

  var boxAnimationReset = false;
  var firstPlay = true;

  // Trigger box UI animation when the IX interaction starts
  addViewportScrollHandler({
    $el: $imageGridWrapper,
    state: {active: false},
    offsetTop: 0.4,
    offsetBot: 0.4,
    intro: function() {
      window.clearInterval(timelineInterval);

      if (!(firstPlay || boxAnimationReset)) {
        return;
      }

      tram($timelineNotch)
        .set({ y: 0 })
        .add('transform 500ms ease-out-quint')
        .wait(800)
        .then(function() { setNotchTime('1.50', 2, this); })
        .then({ y: 55 }) // Open Details
        .wait(1300)
        .then(function() { setNotchTime('3.20', 3, this); })
        .then({ y: 113 }) // Reveal
        .wait(600)
        .then(function() { setNotchTime('4.30', 4, this); })
        .then({ y: 168 }) // Like
        .wait(600)
        .then(function() { setNotchTime('5.50', 5, this); })
        .then({ y: 201 }) // Hide Details
        .wait(600)
        .then(function() { setNotchTime('6.00', 6, this); })
        .then({ y: 233 }) // Close
        .wait(600)
        .then(function() { setNotchTime('7.00', 0, this); })
        .then({ y: 288 })
        .wait(400)
        .then('transform 1500ms ease-in-out-quad')
        .then(function() { rewindPlayhead(this); })
        .then({ y: 0 })
        .then(function() {
          setNotchTime('0.00', 1, this);
          window.clearInterval(timelineInterval);
        });

      firstPlay = false;
    },
    outro: function() {
      boxAnimationReset = false;
    },
  });

  // Reset box animation when it's completely out of view
  addViewportScrollHandler({
    $el: $imageGridWrapper,
    state: {active: false},
    offsetTop: 0.0,
    offsetBot: 0.0,
    intro: function() {},
    outro: function() {
      $imageGridWrapper.find('*').each(function(index, el) {
        var $el = $(el);
        tram($el).stop().props = {};
        $el.removeAttr('style');
      });

      window.clearInterval(timelineInterval);
      setNotchTime('0.00', 1);
      tram($timelineNotch).set({ y: 0 });

      boxAnimationReset = true;
    },
  });

  // Initial parallax + mouse element update to avoid a jump
  updateParallaxCards();
  updateMouseElements();

  $(document)
    .on('mousemove', onMouseMove)
    .on('touchmove', onTouchMove)
    .on('scroll', onScroll);


})