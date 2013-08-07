(function() {

var requirejsOptions = {
  baseUrl: './',
  wrap: true,
  paths: {
    'jquery': 'bower_components/jquery/jquery',
    'underscore': 'bower_components/underscore/underscore',
    'backbone': 'bower_components/backbone/backbone',
    'sinon': 'bower_components/plone-mockup/lib/sinon',

    'leaflet': 'bower_components/leaflet/dist/leaflet',
    'vega': 'bower_components/vega/vega',
    'd3': 'bower_components/d3/d3',

    'mockup-registry': 'bower_components/plone-mockup/js/registry',
    'mockup-patterns-base': 'bower_components/plone-mockup/js/patterns/base',
    'mockup-docsapp': 'bower_components/plone-mockup/js/docsapp',
    'mockup-fakeserver': 'bower_components/plone-mockup/tests/fakeserver',

    'mockup-patterns-leaflet': 'js/patterns/leaflet',
    'mockup-patterns-vega': 'js/patterns/vega'
  },
  shim: {
    'underscore': { exports: 'window._' },
    'backbone': { exports: 'window.Backbone' },
    'sinon': { exports: 'window.sinon' },
    'vega': {
      exports: 'window.vg',
      deps: [ 'd3' ]
    }
  }
};

if (typeof exports !== "undefined" && typeof module !== "undefined") {
  module.exports = requirejsOptions;
}
if (typeof requirejs !== "undefined" && requirejs.config) {
  requirejs.config(requirejsOptions);
}

}());
