import PapaParse from 'papaparse';

/**
 * Load a vDDF from a browser File
 */
export default class FileLoader {
  /**
   * Return true if the source is supported
   */
  isSupported(source) {
    const isFileReaderSupported = window.File && window.FileReader && window.Blob;
    const file = Array.isArray(source) ? source[0] : source;

    return (
      isFileReaderSupported && file instanceof window.File
    );
  }

  /**
   * Load the file and return a vDDF
   */
  async load(source, manager) {
    const file = Array.isArray(source) ? source[0] : source;

    // assume file always has header
    const result = await this.constructor.readCsvFile(file);
    const schema = result.data[0].map(c => ({name: c || 'id'}));
    const data = result.data.slice(1, result.data.length);

    // use the filename as title
    const title = file.name ? file.name.replace(/\.[^\.]+$/, '') : '';

    return manager.create(null, 'local://' + file.name, {
      title,
      schema,
      data
    });
  }

  static readCsvFile(file) {
    return new Promise((resolve, reject) => {
      // don't support large file yet ...
      // in the future, we can upload then stream from server
      if (file.size > 1024000) {
        reject(new Error('Only support file less than 1MB.'));
        return;
      }

      // only support csv file
      if (!/\.csv$/.test(file.name)) {
        reject(new Error('Only csv file is supported'));
        return;
      }

      PapaParse.parse(file, {
        error: (err, file, inputElm, reason) => {
          console.log(err);
          reject(err);
        },
        complete: (result) => {
          if (result.errors.length && !result.data) {
            reject(new Error(result.errors[0].message));
          } else {
            // sometime the last row is empty because of blank empty line in the file
            // we want to remove this row for now
            if (result.data) {
              const lastRow = result.data[result.data.length - 1];

              if (lastRow.length == 1 && lastRow[0] === '') {
                result.data.pop();
              }
            }

            resolve(result);
          }
        }
      });
    });
  }
}
