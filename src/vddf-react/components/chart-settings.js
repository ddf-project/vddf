import React from 'react';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';
import { Types } from '../../vddf/schemadetector';
import AdaVizHelper from '../helpers/adaviz';

const style = {
  container: {
    padding: '4px 8px',
    height: 80
  },
  fieldDropdown: {
    width: '24%',
    marginRight: '1%',
    verticalAlign: 'top'
  }
};

export default class ChartSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState(AdaVizHelper.extractMapping(this.props.vddf.visualization));
  }

  updateChart(type) {
    let viz = this.props.vddf.visualization;
    let mapping = this.state;

    this.props.vddf.visualization = AdaVizHelper.updateMapping(type, mapping, viz);
  };

  getFieldList(type) {
    let list = this.props.vddf.schema;

    if (type === 'number') {
      list = list.filter(c => Types.isNumber(c.type));
    } else if (type === 'category') {
      list = list.filter(c => c.type !== Types.Float);
    }

    return list.map(c => c.name);
  }

  getFieldDropdown(field, items) {
    const { key, label } = field;

    const onChange = (event, index, obj) => {
      const value = typeof(obj) === 'object' ? obj.payload : obj;

      this.setState({[key]: value !== '--' ? value : ''});
      setTimeout(() => this.updateChart(), 300);
    };

    if (!items)
      items = this.getFieldList(field.type);

    items.unshift({ payload: '--', text: '(none)' });

    items = items.map(c => {
      if (typeof c === 'object') {
        return c;
      } else {
        return {
          payload: c, text: c
        };
      }

      // until material-ui 14.4
      //<MenuItem key={c} value={c} primaryText={c} />
    });

    return (
      <SelectField key={key} style={style.fieldDropdown} floatingLabelText={label} value={this.state[key] || undefined} onChange={onChange} menuItems={items}>
      </SelectField>
    );
  }

  render() {
    const type = this.props.vddf.chartType;
    let fields;

    // special treatment for some chart types
    switch (type) {
    case 'scatterplot':
      fields = [
        {label: 'X', key: 'category'},
        {label: 'Y', key: 'measurement', type: 'number'},
        {label: 'Color By', key: 'category2', type: 'category'}
      ];
      break;
    case 'treemap':
      fields = [
        {label: 'Category', key: 'category', type: 'category'},
        {label: 'Size', key: 'measurement', type: 'number'}
      ];
      break;
    case 'pie':
    case 'donut':
      fields = [
        {label: 'Category', key: 'category', type: 'category'},
        {label: 'Value', key: 'measurement', type: 'number'}
      ];
      break;
    case 'heatmap':
      fields = [
        {label: 'Row', key: 'category', type: 'category'},
        {label: 'Column', key: 'category2', type: 'category'},
        {label: 'Measurement', key: 'measurement', type: 'number'}
      ];
      break;
    case 'datatable':
      fields = [];
      break;
    default:
      fields = [
        {label: 'Category (X)', key: 'category'},
        {label: 'Value (Y)', key: 'measurement', type: 'number'},
        {label: 'Group By', key: 'category2', type: 'category'}
      ];
    }

    let fieldComponents = fields.map(field => this.getFieldDropdown(field));

    fieldComponents.push(this.getFieldDropdown({label: 'Aggregation', key: 'aggregation'}, ['sum', 'avg', 'min', 'max', 'count']));

    return (
      <div style={style.container}>
        <div>
          {fieldComponents}
        </div>
      </div>
    );
  }
}
