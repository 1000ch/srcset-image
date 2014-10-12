# `<srcset-image>`

## About

Polyfill for srcset feature as Web Components.

## Usage

Load `srcset-image.js` in your HTML.

```html
<script src='srcset-image.js'></script>
```

Modify your `<img>` elements such as following.

```html
<img is='srcset-image' src='path/to/your/image.jpg' width='100' height='100'>
```

### Fallback

If browser does not support `document.registerElement()`, Images will be loaded as usual.

## License

MIT