(function () {
  'use strict';

  var FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42gEFAPr/AP///wAI/AL+Sr4t6gAAAABJRU5ErkJggg==';
  var SrcsetImagePrototype = Object.create(HTMLImageElement.prototype);

  Object.defineProperty(SrcsetImagePrototype, 'srcset', {
    configurable: false,
    enumerable: false,
    get: function () {
      return this.getAttribute('srcset');
    },
    set: function (newValue) {
      this.setAttribute('srcset', newValue);
    }
  });

  SrcsetImagePrototype.createdCallback = function (argument) {
    this.original = this.src;
    this.src = FALLBACK_IMAGE;
  };

  SrcsetImagePrototype.attachedCallback = function () {

    var devicePixelRatio = window.devicePixelRatio;
    var innerWidth = window.innerWidth;

    var src = this.original;
    var srcset = this.srcset;

    var candidates = [{
      url: src,
      w: Infinity,
      x: 1
    }];

    var resolution = {
      w: Infinity,
      x: 1
    };

    var re = /[^\,\s](.+?)\s([0-9]+)([wx])(\s([0-9]+)([wx]))?/g;
    var candidate;
    var match;
    while ((match = re.exec(srcset)) !== null) {

      var url = match[1];
      var number1 = match[2] | 0;
      var unit1 = match[3];
      var number2 = match[5] | 0;
      var unit2 = match[6];

      // find optimal width and dpr
      if (unit1 === 'w' && number1) {
        if (innerWidth < number1 && number1 <= resolution.w) {
          resolution.w = number1;

          // define as candidate
          candidate = {
            url: url,
            w: number1
          };

          if (unit2 === 'x' && number2) {
            if (devicePixelRatio <= number2 && (devicePixelRatio > resolution.x && number2 < resolution.x)) {
              resolution.x = number2;
              candidate.x = resolution.x;
            }
          }

          candidates.push(candidate);
        }
      } else if (unit1 === 'x' && number1) {
        if (devicePixelRatio <= number1 && (devicePixelRatio > resolution.x && number1 < resolution.x)) {
          resolution.x = number1;

          // define as candidate
          candidate = {
            url: url,
            x: number1
          };

          if (unit2 === 'w' && number2) {
            if (innerWidth < number2 && number2 <= resolution.w) {
              resolution.w = number2;
              candidate.w = resolution.w;
            }
          }

          candidates.push(candidate);
        }
      }
    }

    // return matched url with resolution
    var best = FALLBACK_IMAGE;
    candidates.some(function (candidate) {
      if (resolution.w === candidate.w && resolution.x === candidate.x) {
        best = candidate.url;
        return true;
      } else {
        return false;
      }
    });
    if (best === FALLBACK_IMAGE) {
      candidates.some(function (candidate) {
        if (resolution.x === candidate.x || resolution.w === candidate.w) {
          best = candidate.url;
          return true;
        } else {
          return false;
        }
      });
    }

    // set detected url as src
    this.src = best;
  };

  document.registerElement('srcset-image', {
    prototype: SrcsetImagePrototype,
    extends: 'img'
  });
})();