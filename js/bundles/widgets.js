
// if (window.jQuery) {
//   define( "jquery", [], function () {
//     "use strict";
//     return window.jQuery;
//   } );
// }

// define([
//   'jquery',
//   'mockup-registry',
// //   Uncomment the line below to include all patterns from plone-mockup
// //   'mockup-bundles-widgets',
// //   <!~~ Add patterns below this line ~~!>
//   'collectivemockup-patterns-leaflet'
// ], function($, registry) {
//   "use strict";

//   var collectivemockupWidgets = {
//     name: "collectivemockup-widgets",
//     transform: function($root) {
//     // The code you add here will be executed before scanning the DOM

//     }
//   };

//   registry.register(collectivemockupWidgets);

//   // initialize only if we are in top frame
//   if (window.parent === window) {
//     $(document).ready(function() {
//       registry.scan($('body'));
//     });
//   }

//   return collectivemockupWidgets;
// });
