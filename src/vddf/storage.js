import Immutable from 'immutable';

export default class Storage {
  constructor(localStorage) {
    this.localStorage = localStorage;
  }

  track(vddf) {
    vddf.on('update', this.onUpdate);
  }

  restore(vddf) {
    const key = this.getKey(vddf);
    let backup = this.localStorage.getItem(key);

    if (backup) {
      backup = Immutable.fromJS(JSON.parse(backup));

      if (!Immutable.is(vddf.payload, backup)) {
        vddf.payload = backup;
        vddf._updateSchema();
      } else {
        this.localStorage.removeItem(key);
      }
    }
  }

  onUpdate = (event) => {
    let vddf = event.target;

    try {
      this.localStorage.setItem(this.getKey(vddf), JSON.stringify(vddf.serialize()));
    } catch (ex) {
      console.error('Unable to save vddf', ex.stack);
    }
  };

  getKey(vddf) {
    return `vddf-${vddf.uuid}`;
  }
}
