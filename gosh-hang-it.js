(function(window, document, undefined) {

  // Enable strict mode; no shirking or loafing permitted
  "use strict";

  // Array of hangable punctuation characters
  // List comes from spec: https://www.w3.org/TR/css3-text/#hanging-punctuation
  var hangables = ['\'', '"', '‘', '’', '“', '”', ',', '.', '،', '۔', '、', '。', '，', '．', '﹐', '﹑', '﹒', '｡', '､'];

  // Hangable object
  function Hangable(el) {
    this.el = el;
  }

  // Monolithic objecty thing
  var gosh = {};

  gosh.wrapHangables = function(el) {
    var text = el[0].textContent,
        matchChars = new RegExp('[' + hangables.join('|') + ']', 'g');

    text = text.replace(matchChars, function(match) {
      return '<span style="color: red;">' + match + '</span>';
    });

    console.log(text);

    el[0].innerHTML = text; // ain't this going to break everything?
  }

  gosh.doMatched = function(rules) {
    rules.each(function(rule) {
      gosh.wrapHangables(document.querySelectorAll( rule.getSelectors() ));
    });
  }

  gosh.undoUnmatched = function(rules) {

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
  .doMatched(gosh.doMatched)
  .undoUnmatched(gosh.undoUnmatched)

  // Export this whole thing at the end
  window.goshHangIt = gosh;

})(window, document);
