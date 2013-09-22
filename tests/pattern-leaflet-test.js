define([
  'jquery',
  'mockup-registry',
  'mockup-patterns-leaflet'
], function($, registry, Leaflet) {
  "use strict";

  var mocha = window.mocha;

  mocha.setup('bdd');
  mocha.globals(['_leaflet_resize3']);
  $.fx.off = true;
  var assert = function(expr, msg) {
    if (!expr) throw new Error(msg || 'failed');
  };

  /* ==========================
   TEST: Leaflet
  ========================== */

  describe("Leaflet", function() {
    it("display a marker", function() {
      var $el = $('' +
        '<div class="pat-leaflet" data-pat-leaflet="' +
        '  marker: [43.57484912685576, 1.4064323902130127];' +
        '"/>');
      registry.scan($el);
      assert(
        $('.leaflet-map-pane', $el).size() == 1,
        "Leaflet is initialized"
      );
      assert(
        $('img[src$="/18/132096/95749.jpeg"]', $el).size() == 1,
        "We have loaded a tile at the right location."
      );
    });
  });

});
