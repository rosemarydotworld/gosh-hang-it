(function(window, document, undefined) {

  // Enable strict mode; no shirking or loafing permitted
  "use strict";

  // Array of hangable punctuation characters
  // List comes from spec: https://www.w3.org/TR/css3-text/#hanging-punctuation
  var hangables = ['\U002C', '\U002E', '\U060C', '\U06D4', '\U3001', '\U3002', '\UFF0C', '\UFF0E', '\UFE50', '\UFE51', '\UFE52', '\UFF61', '\UFF64'];

  // Monolithic objecty thing
  var gh = {};

  gh.wrapHangables = function(el) {
    // Finds hangable characters in the element and wraps them in <span>s
  }

  gh.doMatched = function(rules) {
    rules.each(function(rule) {
      console.log(rule);
    });
  }

  gh.undoUnmatched = function(rules) {

  }

  // Set up the polyfill
  Polyfill({
    declarations: [
      "hanging-punctuation:first",
      "hanging-punctuation:last"
    ]
  }, {
    include: ["position-sticky"]
  })
  .doMatched(gh.doMatched)
  .undoUnmatched(gh.undoUnmatched)

  // Export this whole thing at the end
  window.goshHangIt = gh;

})(window, document);
