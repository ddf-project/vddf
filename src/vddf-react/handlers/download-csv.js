import { Handles } from '../components/chart';
import { downloadData } from '../../browser/utils';
import exportHtml from '../../vddf/helpers/html-exporter';
import exportCsv from '../../vddf/helpers/csv-exporter';

export default class DownloadCsvHandler {
  register(manager) {
    // manager.addHandle(Handles.UI_TOOLBAR_MENUS, this.addMenu.bind(this));
    manager.addHandle(Handles.UI_TOOLBAR_BUTTONS, this.addToolbarButtons.bind(this));
  }

  addToolbarButtons(buttons, view) {
    const vddf = view.vddf;

    buttons.push({icon: 'mdi-download', title: 'Download as CSV', action: () => this.downloadChart(vddf)});
  }

  addMenu(menus, view) {
    const vddf = view.vddf;

    // menus.push({
    //   title: 'Download as CSV',
    //   action: () => this.downloadChart(vddf)
    // });

    menus.push({
      title: 'Download as HTML',
      action: () => this.downloadHtml(vddf)
    });
  }

  downloadHtml(vddf) {
    const html = exportHtml(vddf, {
      inline: true
    });

    downloadData(`${vddf.title}.html`, 'text/html', html);
  }

  downloadChart(vddf) {
    const csvData = exportCsv(vddf);
    downloadData(`${vddf.title}.csv`, 'application/csv', csvData);
  };
}
