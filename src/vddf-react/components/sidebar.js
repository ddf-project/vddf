import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import AdaVizHelper from '../helpers/adaviz';

const style = {
  container: {
    width: '184px',
    position: 'absolute',
    borderRight: '1px solid #D9D9D9'
  },
  chartIcon: {
    padding: 0,
    height: 20,
    maxWidth: 20,
    verticalAlign: 'middle',
    margin: '0 16px',
    display: 'inline-block'
  },
  chartButton: {
    padding: '0',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left'
  }
};

// XXX: what is the best way to get chart title ?
const chartTitles = {
  'bar': 'Bar Chart',
  'bar.grouped': 'Group Bar',
  'bar.stacked': 'Stack Bar',
  'line': 'Line Chart',
  'pie': 'Pie Chart',
  'donut': 'Donut Chart',
  'heatmap': 'Heat Map',
  'treemap': 'Tree Map',
  'scatterplot': 'Scatter Plot'
};

// list of types that will be rendered nested ...
const nestedTypes = ['bar.grouped', 'bar.stacked'];

export default class Sidebar extends React.Component {
  static contextTypes = {
    baseUrl: React.PropTypes.string
  };

  changeChartType(type) {
    let vddf = this.props.vddf;
    let viz = vddf.visualization;

    vddf.visualization = AdaVizHelper.updateType(type, viz);
  }

  getChartTypes() {
    const types = this.props.vddf.getAvailableCharts()
            .filter(type => type !== 'datatable')
            .map(type => this.getChartButton(type));

    return types;
  }

  getChartButton(type) {
    const baseUrl = this.context.baseUrl;
    const buttonStyle = Object.assign({}, style.chartButton);
    const title = chartTitles[type] || type;
    let background = null;

    if (type === this.props.vddf.chartType) {
      background= '#D9D9D9';
    }

    if (nestedTypes.indexOf(type) !== -1) {
      buttonStyle.paddingLeft = '24px';
    }

    return (
      <FlatButton key={type} backgroundColor={background} style={buttonStyle} onClick={() => this.changeChartType(type)}>
        <img style={style.chartIcon} src={`${baseUrl}chart-icons/${type}.svg`} />
        <span style={{verticalAlign: 'middle', textTransform: 'none', fontWeight: 300}}>{title}</span>
      </FlatButton>
    );
  }

  render() {
    return (
      <div style={{...style.container, height: this.props.height}} className='vddf-chart-sidebar'>
        {this.getChartTypes()}
      </div>
    );
  }
}
