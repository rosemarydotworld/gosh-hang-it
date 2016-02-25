(function(window, document, undefined) {

  // Enable strict mode; no shirking or loafing permitted
  "use strict";

  // Array of hangable punctuation characters
  var hangables = ['\'', '"', '‘', '’', '“', '”', ',', '.', '،', '۔', '、', '。', '，', '．', '﹐', '﹑', '﹒', '｡', '､'];

  // Monolithic objecty thing
  var gosh = {};

  // Array of Hangable objects will live here
  gosh.chars = [];

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

  gosh.instantiateHangables = function() {
    // Make a new Hangable object to manage each hangable character

    var chars = document.querySelectorAll('[data-hang]');

    for (var i = 0; i < chars.length; ++i) {
      var char = chars[i];

      var hangable = new Hangable(char);
    }
  }

  gosh.doMatched = function(rules) {
    rules.each(function(rule) {
      var matchedEl = document.querySelectorAll( rule.getSelectors() )[0];

      gosh.wrapHangables(matchedEl);
      gosh.instantiateHangables();
    });
  }

  gosh.undoUnmatched = function(rules) {

  }

  // Hangable object
  function Hangable(el) {
    this.el = el;
    this.container = this.getFirstBlockParent();

    this.width = this.getRelativeWidth();
    this.hang();

    gosh.chars.push(this);
  }

  Hangable.prototype.getFirstBlockParent = function() {
    var el = this.el;

    // Loop through parent nodes until we find a block, or close enough
    while (el.parentNode) {
      el = el.parentNode;
      var display = getComputedStyle(el).display;

      if (display == "block" || display == "flex" || display == "grid") {
        return el;
      }
    }
  }

  Hangable.prototype.getRelativePosition = function() {
    var containerOffset, elOffset;

    containerOffset = this.getContainerTrueOffset();
    elOffset = this.el.offsetLeft;

    this.el.setAttribute('data-hang-position', elOffset - containerOffset);
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

    var containerOffset = this.container.offsetLeft + this.container.clientLeft;
    return containerOffset;
  }

  // Set up the polyfill
  Polyfill({
    declarations: ["hanging-punctuation:first"]
  }, {
    include: ["position-sticky"]
  })
  .doMatched(gosh.doMatched)
  .undoUnmatched(gosh.undoUnmatched)

  // Export this whole thing at the end
  window.goshHangIt = gosh;

})(window, document);
