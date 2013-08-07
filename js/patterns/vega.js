define([
  'jquery',
  'vega',
  'mockup-patterns-base'
], function($, vg, Base) {
  "use strict";

  var vegaPattern = Base.extend({
    name: "vega",
    defaults: {},

    init: function() {
      var self = this;
      self.container = self.$el[0];
      var json_source = self.container.dataset.src;
      if(json_source) {
        $.getJSON(json_source, null, function(data) {
          self.render(data);
        });
      } else {
        self.render(self.options);
      }
    },

    render: function(spec) {
      var self = this;
      vg.parse.spec(spec, function(chart) {
        var view = chart({'el': self.container}).update();
      });
    }
  });

  return vegaPattern;

});
