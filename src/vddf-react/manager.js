/* eslint-disable */

import Manager from '../vddf/manager';
import ReactRenderer from './renderer';
import DownloadCsvHandler from './handlers/download-csv';
import EmbedScriptLoader from './loaders/embed-script';

export default class ReactvDDFManager extends Manager {
  constructor(...args) {
    super(...args);

    this.config.renderer = new ReactRenderer();
    this.config.renderer.loadResources();

    this.addHandler(new DownloadCsvHandler());
    this.addLoader(new EmbedScriptLoader());
  }
}
