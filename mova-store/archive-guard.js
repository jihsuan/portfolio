(function () {
  'use strict';
  window.MOVA_ARCHIVE_MODE = true;
  var nativeFetch = window.fetch ? window.fetch.bind(window) : null;
  var emptyCart = {items: [], item_count: 0, total_price: 0, total_discount: 0, sections: {}};
  function localAllowed(url) {
    try {
      var u = new URL(url, location.href);
      return u.protocol === 'file:' || u.origin === location.origin && /\.(?:html|json|js|mjs|css|webp|jpg|jpeg|png|svg|woff2?|ttf|pdf)(?:$|\?)/i.test(u.pathname);
    } catch (_) { return false; }
  }
  if (nativeFetch) window.fetch = function (input, options) {
    var url = typeof input === 'string' ? input : input && input.url || '';
    if (/\/cart(?:\/|\.js|\.json|$|\?)/i.test(url)) return Promise.resolve(new Response(JSON.stringify(emptyCart), {status: 200, headers: {'Content-Type': 'application/json'}}));
    if (localAllowed(url) && !(options && options.method && !/^(GET|HEAD)$/i.test(options.method))) return nativeFetch(input, options);
    return Promise.resolve(new Response('{}', {status: 200, headers: {'Content-Type': 'application/json'}}));
  };
  try { navigator.sendBeacon = function () { return false; }; } catch (_) {}
  if (window.XMLHttpRequest) {
    var nativeOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      if (!localAllowed(url) || !/^(GET|HEAD)$/i.test(method)) {
        arguments[0] = 'GET';
        arguments[1] = 'data:application/json,{}';
      }
      return nativeOpen.apply(this, arguments);
    };
  }
  window.Shopify = window.Shopify || {};
  window.Shopify.routes = window.Shopify.routes || {root: './'};
}());
