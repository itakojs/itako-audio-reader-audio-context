// dependencies
import Promise from 'bluebird';
import axios from 'axios';

// @class ItakoAudioReaderAudioContext
export default class ItakoAudioReaderAudioContext {
  /**
  * @constructor
  * @param {string} type - a target token type
  * @param {object} [options={}] - a token default options
  */
  constructor(type = 'audio', options = {}) {
    this.name = 'audio-context';
    this.readType = type;
    this.opts = {
      volume: 1,
      pitch: 1,
      ...options,
    };

    this.audioContext = new AudioContext;
    this.enableAudioContext();

    this.sourceNodes = [];
  }

  /**
  * monky patching for iOS
  * @see http://qiita.com/uupaa/items/e5856e3cb2a9fc8c5507
  * @see https://github.com/beraboume/nicolive.berabou.me/blob/master/app/services/sound-enabler.coffee
  * @returns {undefined}
  */
  enableAudioContext() {
    window.addEventListener('touchstart', function enable() {
      window.removeEventListener('touchstart', enable);

      // use brfs/transform-loader (see https://github.com/webpack/transform-loader#readme)
      const buffer = require('fs').readFileSync(`${__dirname}/sound-enabler.mp3`);
      const arraybuffer = new ArrayBuffer(buffer.length);
      new Uint8Array(arraybuffer).set(buffer);
      this.play(arraybuffer);
    });
  }

  /**
  * @method preload
  * @param {token} token - a itako-token instance
  * @returns {boolean} - returns true if preloaded
  */
  preload(token) {
    if (token.type !== this.readType) {
      return false;
    }

    token.setMeta('preloadStart', Date.now());
    token.setMeta('preload', this.createRequest(token));
    token.meta.preload.then(() => {
      token.setMeta('preloadEnd', Date.now());
    });
    return true;
  }

  /**
  * @method read
  * @param {token} token - a itako-token instance
  * @returns {promise|token} - returns the promise only when reading
  */
  read(token) {
    if (token.type !== this.readType) {
      return token;
    }

    const request = token.meta.preload || this.createRequest(token);
    return request
    .then((response) => this.play(response.data, token.options))
    .then((nodes) => token.setMeta('nodes', nodes));
  }

  /**
  * @method createRequest
  * @param {token} token - a itako-token instance
  * @returns {promise} - the executing request
  */
  createRequest(token) {
    const options = typeof token.value === 'string' ? { url: token.value } : { ...token.value };
    options.responseType = 'arraybuffer';

    return axios(options);
  }

  /**
  * @method play
  * @param {arrayBuffer} arrayBuffer - an audio buffer
  * @param {object} [options={}] - a gain/playbackRate options
  * @returns {promise} - returns the used nodes after playing
  */
  play(arrayBuffer, options = {}) {
    return new Promise((resolve) => {
      this.audioContext.decodeAudioData(arrayBuffer, resolve);
    })
    .then((decodedAudioData) => new Promise((resolve) => {
      const gainNode = this.audioContext.createGain();

      // @see http://www.html5rocks.com/en/tutorials/webaudio/intro/
      const volume = options.volume || 1;
      gainNode.gain.value = volume;
      gainNode.connect(this.audioContext.destination);

      const sourceNode = this.audioContext.createBufferSource();
      sourceNode.buffer = decodedAudioData;
      sourceNode.playbackRate.value = options.pitch || options.speed || 1;
      sourceNode.connect(gainNode);

      sourceNode.addEventListener('ended', () => {
        gainNode.disconnect();

        const index = this.sourceNodes.indexOf(sourceNode);
        if (index > -1) {
          this.sourceNodes.splice(index, 1);
        }

        resolve({ gainNode, sourceNode });
      });

      if (sourceNode.start) {
        sourceNode.start(0);
      } else {
        sourceNode.noteOn(0); // Chrome <= 32
      }

      // avoid the garbage collection
      this.sourceNodes.push(sourceNode);
    }));
  }
}
