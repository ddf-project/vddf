import Manager from './manager';
import DummyStorage from 'test-utils/dummy-storage';
import { assert } from 'chai';

describe('Manager', () => {
  let dummyStorage = null;
  let manager = null;

  beforeEach(() => {
    dummyStorage = new DummyStorage();
    manager = new Manager({}, dummyStorage);
  });

  it('can load inline vddf', async () => {
    let vddf = await manager.load({
      schema: [{name: 'c1'}, {name: 'c2'}],
      data: [
        [1, 'a'],
        [2, 'b']
      ],
      visualization: {}
    });

    // just some smoke check
    assert.isNotNull(vddf);
    assert.equal('Integer', vddf.schema[0].type);
  });

  it('should call vddf server to load uri');

  it('should load uri directly when baseUrl is not available');
});
