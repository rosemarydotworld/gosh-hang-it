(function(window, document, undefined) {

  // Enable strict mode; no shirking or loafing permitted
  "use strict";

  // Array of hangable punctuation characters
  // List comes from spec: https://www.w3.org/TR/css3-text/#hanging-punctuation
  var hangables = ['\'', '"', '‘', '’', '“', '”', ',', '.', '،', '۔', '、', '。', '，', '．', '﹐', '﹑', '﹒', '｡', '､'];

  // Hangable object
  function Hangable(el, matchedEl) {
    this.el = el;
    this.container = matchedEl;

    this.width = this.getRelativeWidth();

    this.hang();
  }

  Hangable.prototype.getRelativePosition = function() {
    var containerOffset, elOffset;

    containerOffset = this.getContainerTrueOffset();
    elOffset = this.el.offsetLeft;

    return elOffset - containerOffset;
  }

  Hangable.prototype.getRelativeWidth = function() {
    return this.el.offsetWidth;
  }

  Hangable.prototype.hang = function() {
    if (this.getRelativePosition() == 0) {
      this.el.style.marginLeft = (-1 * this.getRelativeWidth()) + 'px';
    }
  }

  Hangable.prototype.getContainerTrueOffset = function() {
    // Borders count toward the offset, believe it or not

    var containerOffset = this.container.offsetLeft,
        containerStyle,
        containerBorder;

    containerStyle = getComputedStyle(this.container, null);
    containerBorder = containerStyle.getPropertyValue('border-left-width');

    return containerOffset + parseInt(containerBorder, 10);
  }

  // Monolithic objecty thing
  var gosh = {};

  gosh.wrapHangables = function(el) {
    // Wrap hangable characters in an easily queryable and styleable span

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
          return '<span data-hang>' + match + '</span>';
        });

        temp.innerHTML = text;

        node.parentElement.insertBefore(temp, node);
        node.parentElement.removeChild(node);
      }
    }
  }

  gosh.instantiateHangables = function(matchedEl) {
    // Make a new Hangable object to manage each hangable character

    var chars = document.querySelectorAll('[data-hang]');

    for (var i = 0; i < chars.length; ++i) {
      var char = chars[i];

      var hangable = new Hangable(char, matchedEl);
    }
  }

  gosh.doMatched = function(rules) {
    rules.each(function(rule) {
      var matchedEl = document.querySelectorAll( rule.getSelectors() )[0];

      gosh.wrapHangables(matchedEl);
      gosh.instantiateHangables(matchedEl);
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
