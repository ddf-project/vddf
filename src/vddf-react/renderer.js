import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './components/chart';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { loadMaterialFonts } from '../browser/utils';

/**
 * vDDF renderer with React and AdaViz
 */
export default class ReactRenderer {

  async loadResources() {
    try {
      injectTapEventPlugin();
    } catch (ex) {
      // safe to ingore
    }

    loadMaterialFonts();

    require('./styles.css');
  }

  async render(vddf, el) {
    try {
      let width = el.getAttribute('data-width');
      let height = el.getAttribute('data-height');
      const mode = el.getAttribute('data-mode');
      const active = el.getAttribute('data-active');

      // if not specify width, try to get element outer width
      if (!width) {
        width = el.offsetWidth;
      }

      // TODO: support full screen
      if (!height) {
        height = width * 3/4;
      }

      if (mode === 'fullscreen') {
        width = window.innerWidth;
        height = window.innerHeight;
      }

      // cleanup
      ReactDOM.unmountComponentAtNode(el);
      el.innerHTML = '';
      el.__vddf__ = vddf;

      if (el.className.indexOf('vddf-chart') === -1) {
        el.className = ' vddf-chart';
      }

      ReactDOM.render(this.getComponent(vddf, {
        width, height, mode, active
      }), el);
    } catch (ex) {
      el.innerHTML = `Error: ${ex.message}`;
      console.log(ex.stack);
    }
  }

  getComponent(vddf, props) {
    return <Chart vddf={vddf} baseUrl={vddf.config.baseUrl} {...props} />;
  }
}
