var Webflow = {};
var modules = {};
var primary = [];
var secondary = window.Webflow || [];
var $ = window.jQuery;
var $win = $(window);
var $doc = $(document);
var isFunction = $.isFunction;
var domready = false;
var destroyed = false;
var Modernizr = window.Modernizr;
tram.config.hideBackface = false;
tram.config.keepInherited = true;

/**
 * Webflow.resize, Webflow.scroll - throttled event proxies
 */
var resizeEvents = 'resize.webflow orientationchange.webflow load.webflow';
var scrollEvents = 'scroll.webflow ' + resizeEvents;
Webflow.resize = eventProxy($win, resizeEvents);
Webflow.scroll = eventProxy($win, scrollEvents);
Webflow.redraw = eventProxy();

// Create a proxy instance for throttled events
function eventProxy(target, types) {

  // Set up throttled method (using custom frame-based _.throttle)
  var handlers = [];
  var proxy = {};
  proxy.up = _.throttle(function(evt) {
    _.each(handlers, function(h) { h(evt); });
  });

  // Bind events to target
  if (target && types) target.on(types, proxy.up);

  /**
   * Add an event handler
   * @param  {function} handler
   */
  proxy.on = function(handler) {
    if (typeof handler !== 'function') return;
    if (_.contains(handlers, handler)) return;
    handlers.push(handler);
  };

  /**
   * Remove an event handler
   * @param  {function} handler
   */
  proxy.off = function(handler) {
    // If no arguments supplied, clear all handlers
    if (!arguments.length) {
      handlers = [];
      return;
    }
    // Otherwise, remove handler from the list
    handlers = _.filter(handlers, function(h) {
      return h !== handler;
    });
  };

  return proxy;
}