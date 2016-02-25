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
    var nodes = el.childNodes,
        matchChars = new RegExp('[' + hangables.join('|') + ']', 'g');

    for (var i = 0; i < nodes.length; ++i) {
      var node = nodes[i];

      if(node.nodeType == 1) {
        // Recurse elements: gotta get to the juicy text nodes inside the HTML
        gosh.wrapHangables(node);
      } else if(node.nodeType == 3) {
        // For text nodes, wrap the hangable characters in spans and then wrap
        // that whole mess in another span so we can operate upon it in HTML
        var text = node.textContent,
            temp = document.createElement('span');

        text = text.replace(matchChars, function(match) {
          return '<span data-hang style="color: red;">' + match + '</span>';
        });

        temp.innerHTML = text;

        node.parentElement.insertBefore(temp, node);
        node.parentElement.removeChild(node);
      }
    }
  }

  gosh.instantiateHangables = function() {
    var hangables = document.querySelectorAll('[data-hang]');
    console.log(hangables);
  }

  gosh.doMatched = function(rules) {
    rules.each(function(rule) {
      gosh.wrapHangables(document.querySelectorAll( rule.getSelectors() )[0]);
      gosh.instantiateHangables();
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
