Itako Audio Reader Audio Context
---

<p align="right">
  <a href="https://npmjs.org/package/itako-audio-reader-audio-context">
    <img src="https://img.shields.io/npm/v/itako-audio-reader-audio-context.svg?style=flat-square">
  </a>
  <a href="https://ci.appveyor.com/project/59naga/itako-audio-reader-audio-context">
    <img src="https://img.shields.io/appveyor/ci/59naga/itako-audio-reader-audio-context.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/itakojs/itako-audio-reader-audio-context/coverage">
    <img src="https://img.shields.io/codeclimate/github/itakojs/itako-audio-reader-audio-context.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/itakojs/itako-audio-reader-audio-context">
    <img src="https://img.shields.io/codeclimate/coverage/github/itakojs/itako-audio-reader-audio-context.svg?style=flat-square">
  </a>
  <a href="https://gemnasium.com/itakojs/itako-audio-reader-audio-context">
    <img src="https://img.shields.io/gemnasium/itakojs/itako-audio-reader-audio-context.svg?style=flat-square">
  </a>
</p>

Installation
---
```bash
npm install itako-audio-reader-audio-context --save
```

Usage
---

## `ItakoAudioReaderAudioContext(type, options)` -> `reader`

specify instance as first argument of the [Itako constructor](https://github.com/itakojs/itako#usage) as the value of the array.

```html
<script src="https://npmcdn.com/itako"></script>
<script src="https://npmcdn.com/itako-audio-reader-audio-context"></script>
<script>
var reader = new ItakoAudioReaderAudioContext('audio', {
  // default gain volume (1~0)
  volume: 1,

  // default audio playbackRate (~0)
  pitch: 1,
});
var itako = new Itako([reader], [{
  transform: function(tokens){
    return tokens.map(function(token){
      return token.setType('audio');
    })
  },
}]);

// read the first argument as audio(via transform)
itako.read('http://static.edgy.black/fixture.wav');
</script>
```

See also
---
- [itako - a pluggable text reader](https://github.com/itakojs/itako)

Development
---
Requirement global
* NodeJS v5.10.0
* Npm v3.7.1
* Chrome Launcher 49.0.2623 (Mac OS X 10.11.4)

```bash
git clone https://github.com/itakojs/itako-audio-reader-audio-context
cd itako-audio-reader-audio-context
npm install

npm test
```

License
---
[MIT](http://59naga.mit-license.org/)
