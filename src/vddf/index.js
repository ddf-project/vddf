import 'whatwg-fetch';

if (!window._babelPolyfill) {
  require('babel-polyfill');
}

window.vDDF = window.vDDF || {};

// init the manager
if (window.vDDF && !window.vDDF.manager) {
  const Manager = require('../vddf-react/manager').default;
  window.vDDF.manager = new Manager(window.vDDF.config);
}
