/**
 * Load a VDDF from js object
 */
export default class InlineLoader {
  isSupported(source) {
    return typeof source === 'object' && Array.isArray(source.data);
  }

  async load(source, manager) {
    // extract schema from array of object
  	if (!source.schema && typeof source.data[0] === 'object') {
      const { schema, data } = this.constructor.extractSchema(source.data);

      source.schema = schema;
      source.data = data;
  	}

    return manager.create(source.uuid, source.uri, source);
  }

  static extractSchema(data) {
    let schema = [];
    let newData = data.map(d => {
      const row = Object.values(d);

      if (schema.length === 0) {
        schema = Object.keys(d).map(f => {
          return {
            name: f
          };
        });
      }

      return row;
    });

    return {
      data: newData,
      schema: schema
    };
  }
}
