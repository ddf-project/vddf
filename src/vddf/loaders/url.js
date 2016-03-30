import fetch from 'fetch';

/**
 * Load a vDDF from a remote URL
 *
 * If vDDF server is available, then we will ask
 * the server to load the file for us
 */
export default class UrlLoader {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
  }

  isSupported(source) {
    return typeof source === 'string';
  }

  async load(source, manager) {
    let response;

    // if server url is available, then ask server to load the file
    // else just load by ourself
    if (this.serverUrl) {
      response = await fetch(`${this.serverUrl}/api/vddf/load`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uri: source })
      });
    } else {
      response = await fetch(source, {});
    }

    if (response.status !== 200) {
      throw new Error(`Unable to retrieve vDDF`);
    }

    let json = await response.json();

    if (json.error) {
      throw new Error(json.error.message);
    }

    const result = json.result || json;

    return manager.create(result.uuid, source, result);
  }
}
