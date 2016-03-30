import { assert } from 'chai';
import suggest from './charttypes';

describe('ChartTypes', () => {
  context('# suggest', () => {
    let types;

    it('should suggest bar chart', () => {
      types = suggest([{type: 'String'}, {type: 'Integer'}]);

      assert.include(types, 'bar');
      assert.notInclude(types, 'scatterplot');
    });

    it('should suggest scatterplot and bar chart', () => {
      types = suggest([{type: 'String'}, {type: 'Integer'}, {type: 'Float'}]);

      assert.include(types, 'bar');
      assert.include(types, 'scatterplot');
    });

    it('should suggest heatmap and grouped bar chart', () => {
      types = suggest([{type: 'String'}, {type: 'String'}, {type: 'Float'}]);

      assert.include(types, 'heatmap');
      assert.include(types, 'bar.grouped');
      assert.include(types, 'bar.stacked');
    });
  });
});
