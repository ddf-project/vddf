export const Types = {
  Integer: 'Integer',
  Float: 'Float',
  String: 'String',

  isNumber: function(type) {
    return type == this.Integer || type == this.Float;
  }
};

const NumberTest = /^-?[\d,]+(\.\d+)?(e[+-]?\d+)?$/;

export default class SchemaDetector {
  detect(data, schema) {
    let hintTypes = {};
    let newSchema = schema.map(c => ({
      name: c.name, type: c.type
    }));

    data.some(row => {
      let isStillRunning = false;

      newSchema.forEach((c,j) => {
        if (!c.type) {
          const value = row[j];
          const type = this.detectValue(row[j]);
          const isEmpty = value === '' || value === undefined || value === null;

          // if we don't have a type or so far we only have empty value
          // then pick up the current type
          if (!hintTypes[j] || hintTypes[j].isAllEmpty) {
            hintTypes[j] = {
              type: type,
              isAllEmpty: isEmpty
            };
          } else if (hintTypes[j].type !== type) {
            const hintType = hintTypes[j].type;

            // prefer float over integer
            if (hintType == Types.Integer && type == Types.Float) {
              hintTypes[j].type = type;
            } else if (type == Types.String && !isEmpty) {
              hintTypes[j].type = type;
            }
          }
        }

        // keep running when there is undetected column
        isStillRunning = isStillRunning || c.type === undefined;
      });

      return !isStillRunning;
    });

    // merge hint types to schema
    newSchema.forEach((c,i) => {
      if (!c.type && hintTypes[i]) {
        c.type = hintTypes[i].type;
      }
    });

    return newSchema;
  }

  detectValue(value) {
    let m;

    if (typeof value === 'number') {
      if (value % 1 !== 0) {
        return Types.Float;
      } else {
        return Types.Integer;
      }
    }
    else if (m = NumberTest.exec(value)) {
      if (m && m[1]) {
        return Types.Float;
      } else {
        return Types.Integer;
      }
    } else {
      return Types.String;
    }
  }
}
