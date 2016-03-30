/**
 * Export a vDDF to static html file
 */
export default function exportHtml(vddf, options = {}) {
  const width = options.width || 800;
  const height = options.height || 600;
  const scriptUrl = options.scriptUrl || (vddf.manager.config.baseUrl + '/embed.js');
  let embedJson = '';
  let uri = vddf.uri;

  // embed the vddf if we want to export it inline
  if (options.inline) {
    const json = JSON.stringify(vddf.serialize());

    embedJson = `<script id='inline-${vddf.uuid}' type="text/vddf-json">${json}</script>\n`;
    uri = `inline://${vddf.uuid}`;
  }

  let html = `<html>\n` +
        `<head><meta http-equiv="content-type" content="text/html; charset=UTF8"></head>\n` +
        `<body>\n` +
        `<div data-width="${width}" data-height="${height}" data-vddf="${uri}" data-active=\"1\"></div>\n` +
        embedJson +
        `<script type="text/javascript" src="${scriptUrl}"></script>\n` +
        `</body></html>`;

  return html;
}
