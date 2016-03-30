import Storage from './storage';
import vDDF from './vddf';
import UrlLoader from './loaders/url';
import InlineLoader from './loaders/inline';

export default class Manager {
  constructor(config, storage) {
    if (!storage) {
      storage = new Storage(window.localStorage);
    }

    this.config = config || {};
    this.storage = storage;
    this.handlers = {};
    this.client = this.config.client;

    // setup loaders with default loaders
    this.loaders = [
      new UrlLoader(this.config.baseUrl),
      new InlineLoader()
    ];
  }

  addHandler(handler) {
    handler.register(this);
  }

  addHandle(name, callback) {
    if (!this.handlers[name]) {
      this.handlers[name] = [];
    }

    this.handlers[name].push(callback);
  }

  handle(name, ...args) {
    let result = null;

    if (this.handlers[name]) {
      const handlers = this.handlers[name];

      for (let i = 0; i < handlers.length; i++) {
        let handle = handlers[i];
        result = handle(...args);
      }
    }

    return result;
  }

  create(uuid, source, data) {
    let vddf = new vDDF(uuid, source, this.config);
    vddf.manager = this;

    if (!data.visualization) {
      data.visualization = {
        type: 'datatable'
      };
    }

    vddf.deserialize(data);

    return vddf;
  }

  async render(vddf, ...params) {
    if (this.config.renderer) {
      this.config.renderer.render(vddf, ...params);
    } else {
      throw new Error('Renderer is not available');
    }
  }

  async embed(vddf) {
    return this.client.request('GET', `api/vddf/${vddf.uuid}/embed`);
  }

  // export keyword has problem with emacs :(
  async ['export'](vddf) {
    let body = vddf.serialize();

    // remove uuid and change the source
    delete body.uuid;
    body.source = vddf.uri;

    return this.client.request('POST', 'api/vddf/create', body)
      .then(result => {
        vddf.uuid = result.uuid;

        return result;
      });
  }

  addLoader(loader) {
    this.loaders.unshift(loader);
  }

  async load(source) {
    let vddf;

    // loop through all loaders to check if any of it support this source
    for (let i in this.loaders) {
      const loader = this.loaders[i];

      if (loader.isSupported(source)) {
        vddf = await loader.load(source, this);
        break;
      }
    }

    if (!vddf) {
      throw new Error('Source type is not supported');
    } else if (vddf.uuid) {
      // restore from local storage and track changes
      this.storage.restore(vddf);
      this.storage.track(vddf);
    }

    return vddf;
  }
}
