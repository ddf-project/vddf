import SchemaDetector, { Types } from './schemadetector';
import { assert } from 'chai';

describe('SchemaDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new SchemaDetector();
  });

  context('# detect', () => {
    it('should detect number and string correctly', () => {
      let series = [[1,'test'], [2, 'test2']];
      let schema = detector.detect(series, [{name: 'c1'}, {name: 'c2'}]);

      assert.equal(Types.Integer, schema[0].type);
      assert.equal(Types.String, schema[1].type);
    });

    it('should detect mixed number correctly', () => {
      let series = [[1], ['1'], ['2']];
      let schema = detector.detect(series, [{name: 'c1'}]);

      assert.equal(Types.Integer, schema[0].type);
    });

    it('should prefer float over integer', () => {
      let series = [[1], [1.1], [2], [3], ['-1']];
      let schema = detector.detect(series, [{name: 'c1'}]);

      assert.equal(Types.Float, schema[0].type);
    });

    it('should not override existing type', () => {
      let series = [[1, 'a', '1'], [1.1, 'b', '2'], [2, 'c', '3']];
      let schema = detector.detect(series, [{name: 'c1', type: Types.String}, {name: 'c2'}, {name: 'c3'}]);

      assert.equal(Types.String, schema[0].type);
      assert.equal(Types.String, schema[1].type);
      assert.equal(Types.Integer, schema[2].type);
    });

    it('should treat null and empty string as same type', () => {
      let series = [[1], [null], [2]];
      let schema = detector.detect(series, [{name: 'c1'}]);
      assert.equal(Types.Integer, schema[0].type);

      series = [[null], [1], [2]];
      schema = detector.detect(series, [{name: 'c1'}]);
      assert.equal(Types.Integer, schema[0].type);
    });

    it('should treat all null as string', () => {
      let series = [[null], [null], [null]];
      let schema = detector.detect(series, [{name: 'c1'}]);
      assert.equal(Types.String, schema[0].type);
    });
  });

  context('# detectValue', () => {
    it('should detect number type correctly', () => {
      let type = detector.detectValue("1");
      assert.equal(Types.Integer, type);

      type = detector.detectValue("1.1");
      assert.equal(Types.Float, type);

      type = detector.detectValue(1.1);
      assert.equal(Types.Float, type);

      type = detector.detectValue(-5);
      assert.equal(Types.Integer, type);

      type = detector.detectValue("1e+05");
      assert.equal(Types.Integer, type);

      assert.equal(Types.Integer, detector.detectValue("1,234"));
      assert.equal(Types.Integer, detector.detectValue("1,234,567"));
    });

    it('should detect string type correctly', () => {
      let type = detector.detectValue('hello');
      assert.equal(Types.String, type);
    });
  });

  context('# Types', () => {
    it('should return true if type is number', () => {
      assert.isTrue(Types.isNumber(Types.Float));
      assert.isTrue(Types.isNumber(Types.Integer));

      assert.isFalse(Types.isNumber(Types.String));
    });
  });
});
