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

        node.parentNode.insertBefore(temp, node);
        node.parentNode.removeChild(node);
      }
    }
  }

  gosh.unwrapHangables = function(el) {
    // Unwrap hangable characters to get the DOM mostly back to normal

    var nodes = el.childNodes;
    console.log(nodes);
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

  gosh.unhangAll = function(rules) {
    gosh.chars.forEach(function(char) {
      char.unhang().destroy();
    });
  }

  // Hangable object
  function Hangable(el) {
    this.el = el;
    this.container = this.getFirstBlockParent();

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
    return (this.el.offsetWidth / this.getContainerWidth());
  }

  Hangable.prototype.hang = function() {
    this.el.style.marginLeft = '';

    if (this.getRelativePosition() == 0) {
      this.el.style.marginLeft = (-100 * this.getRelativeWidth()) + '%';
    }

    return this;
  }

  Hangable.prototype.unhang = function() {
    // get the element's parent node
    var parent = this.el.parentNode;

    // move all children out of the element
    while (this.el.firstChild) parent.insertBefore(this.el.firstChild, this.el);

    // remove the empty element
    parent.removeChild(this.el);

    return this;
  }

  Hangable.prototype.destroy = function() {
    delete this;
  }

  Hangable.prototype.getContainerTrueOffset = function() {
    // Borders count toward the offset, believe it or not

    var containerOffset = this.container.offsetLeft + this.container.clientLeft;
    return containerOffset;
  }

  Hangable.prototype.getContainerWidth = function() {
    return this.container.clientWidth;
  }

  // Set up the polyfill
  window.onload = function() {
    Polyfill({
      declarations: ["hanging-punctuation:first"]
    })
    .doMatched(gosh.doMatched)
    .undoUnmatched(gosh.unhangAll);
  }

  // Make it Responsive(tm)
  window.onresize = function() {
    gosh.chars.forEach(function(char) {
      char.hang();
    });
  }

  // Export this whole thing at the end
  window.goshHangIt = gosh;

})(window, document);
