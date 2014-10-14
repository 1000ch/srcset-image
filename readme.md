# [`<srcset-image>`](http://1000ch.github.io/srcset-image/)

## About

Polyfill for srcset feature as Web Components.

## Usage

Load `srcset-image.js` in your HTML.

```html
<script src='srcset-image.js'></script>
```

Modify your `<img>` elements such as following ([srcset feature specification](http://dev.w3.org/html5/srcset/)).

```html
<img is='srcset-image' src='image.jpg' srcset='image-1.5x.jpg 1.5x, image-2x.jpg 2x'>
```

### Fallback

If browser does not support `document.registerElement()`, Images will be loaded as usual.

## License

MIT