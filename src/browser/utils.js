export function generateDataUrl(type, data) {
  return `data:${type}:charset=utf-8,` + encodeURIComponent(data);
}

export function downloadData(filename, type, data) {
  let link = document.createElement('a');
  link.download = filename;
  link.href = generateDataUrl(type, data);
  link.click();
}

export function loadMaterialFonts() {
  // also add material icons resource
  let head = document.getElementsByTagName('head')[0];
  if (head) {
    let iconFont = document.createElement('link');
    iconFont.setAttribute('href', 'https://cdn.materialdesignicons.com/1.5.54/css/materialdesignicons.min.css');
    iconFont.setAttribute('rel', 'stylesheet');

    head.appendChild(iconFont);
  }
}
