define([
  'leaflet',
  'leaflet-geosearch',
  'mockup-patterns-base'
], function(L, lg, Base) {
  "use strict";

  L.Icon.Default.imagePath = "bower_components/leaflet-dist/images";

  var leafletPattern = Base.extend({
    name: "leaflet",
    defaults: {
      tilesurl: '',
      attribution: '',
      subdomains: 'abcd',
      maxzoom: '18',
      minzoom: '',
      center: '[51.505, -0.09]',
      zoom: '13',
      marker: '',
      geojson: '',
      search: '',
      address: ''
    },

    init: function() {
      var self = this;
      var map_div = self.$el[0];

      // map settings
      if(!map_div.style.height) {
        map_div.style.height = "300px";
      }
      var tilesurl;
      var params = {};
      if(!self.options.tilesurl) {
        tilesurl = "http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg";
        params.attribution = "MapQuest / OpenStreetMap";
        params.subdomains = "1234";
      } else {
        tilesurl = self.options.tilesurl;
        params.attribution = self.options.attribution;
        params.subdomains = self.options.subdomains;
      }
      if(self.options.maxzoom) params.maxZoom = parseInt(self.options.maxzoom, 10);
      if(self.options.minzoom) params.minZoom = parseInt(self.options.minzoom, 10);

      // create map
      var map = L.map(map_div).setView(
        JSON.parse(self.options.center),
        parseInt(self.options.zoom, 10)
      );
      L.tileLayer(tilesurl, params).addTo(map);

      // add layers
      var layers = L.featureGroup().addTo(map);
      if(self.options.marker) {
        L.marker(JSON.parse(self.options.marker)).addTo(layers);
      }
      var json_source = map_div.dataset['geojson-src'];
      if(json_source) {
        $.getJSON(json_source, null, function(data) {
          L.geoJson(data).addTo(layers);
          self.fitBounds(map, layers.getBounds());
        });
      } else {
        if(self.options.geojson) {
          L.geoJson(JSON.parse(self.options.geojson)).addTo(map);
        }
      }
      self.fitBounds(map, layers.getBounds());
      

      // search
      if(self.options.search) {
        var Provider = L.GeoSearch.Provider[self.options.search];
        var search = new L.Control.GeoSearch({
          provider: new Provider()
        }).addTo(map);

        if(self.options.address) {
          onLoadGoogleApiCallback = function() {
              L.GeoSearch.Provider.Google.Geocoder = new google.maps.Geocoder();
              search.geosearch(self.options.address);
          };
        }
      }
    },

    fitBounds: function(map, bounds) {
      if (bounds.isValid()) map.fitBounds(bounds);
    }
  });

  return leafletPattern;

});
