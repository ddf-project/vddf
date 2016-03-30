import EventEmitter from 'eventemitter3';
import Immutable from 'immutable';
import SchemaDetector from './schemadetector';
import suggestChartType from './charttypes';

/**
 * vDDF Base Class
 */
export default class vDDF extends EventEmitter {
  constructor(uuid, uri, config) {
    super();
    this.uuid = uuid;
    this.uri = uri;
    this.config = config;
  }

  _emitUpdate() {
    this.emit('update', {
      target: this
    });
  }

  _updateSchema() {
    let detector = new SchemaDetector();
    let newSchema = Immutable.fromJS(detector.detect(this.fetch(), this.schema));

    if (!Immutable.is(this.payload.get('schema'), newSchema)) {
      this.payload = this.payload.set('schema', newSchema);
    }

    this._chartTypes = suggestChartType(this.schema);
  }

  set chartType(value) {
    this.payload = this.payload.mergeDeep({
      visualization: {
        type: value
      }
    });

    this._emitUpdate();
  }

  get chartType() {
    return this.visualization.type;
  }

  getAvailableCharts() {
    return this._chartTypes;
  }

  get title() {
    return this.payload.get('title');
  }

  set title(value) {
    this.payload = this.payload.set('title', value);
    this._emitUpdate();
  }

  get visualization() {
    // we should expose explicitly each visualization attribute
    // to vDDF propert instead of one single chunk
    return this.payload.get('visualization').toJS();
  }

  set visualization(value) {
    this.payload = this.payload.set('visualization', Immutable.fromJS(value));
    this._emitUpdate();
  }

  fetch() {
    return this.payload.get('data').toJS();
  }

  updateData(data, schema) {
    this.payload = this.payload.set('data', Immutable.fromJS(data));

    if (schema) {
      this.payload = this.payload.set('schema', Immutable.fromJS(schema));
      this._updateSchema();
    }

    this._emitUpdate();
  }

  get schema() {
    return this.payload.get('schema').toJS();
  }

  set schema(value) {
    this.payload = this.payload.set('schema', Immutable.fromJS(value));
    this._updateSchema();
    this._emitUpdate();
  }

  async render(...params) {
    return this.manager.render(this, ...params);
  }

  deserialize(payload) {
    payload.schema = payload.schema || [];
    payload.visualization = payload.visualization || {};

    this.payload = Immutable.fromJS(payload);
    this._updateSchema();

    this.originalPayload = this.payload;
  }

  serialize() {
    return this.payload.toJS();
  }

  isModified() {
    return this.uuid && this.payload !== this.originalPayload;
  }

  revert() {
    if (this.originalPayload && this.isModified()) {
      this.payload = this.originalPayload;
      this._updateSchema();
      this._emitUpdate();
    }
  }
}
