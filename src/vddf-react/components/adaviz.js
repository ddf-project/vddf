import React from 'react';
import Immutable from 'immutable';

/**
 * AdaViz Chart component
 */
export default class AdaVizChart extends React.Component {
  static propTypes = {
    spec: React.PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.spec !== this.props.spec
      || nextProps.spec.onRendered !== this.props.onRendered
      || nextProps.spec.onLegendClick !== this.props.onLegendClick
    ;
  }

  componentDidUpdate() {
    this.renderChart();
  }

  componentDidMount() {
    this.renderChart();
  }

  renderChart() {
    let spec = this.props.spec;

    if (Immutable.Iterable.isIterable(spec)) {
      spec = spec.toJS();
    } else {
      console.warning('Spec is not immutable, chart update may not work correctly.');
    }

    spec.theme = {
      background: {
        fill: 'white'
      }
    };

    // bar chart does not render color correctly
    if (spec.input.type === 'bar' && spec.input.color) {
      spec.input.type = 'bar.stacked';
    }

    // TODO: we can bring the whole schema to adaviz
    if (spec.input.mapping) {
      spec.input.variables = spec.input.variables || [];

      spec.input.variables.push({
        type: 'string',
        name: spec.input.mapping.category
      });

      spec.input.variables.push({
        type: 'float',
        name: spec.input.mapping.measurement
      });

      if (spec.input.mapping.category2) {
        spec.input.variables.push({
          type: 'string',
          name: spec.input.mapping.category2
        });
      }
    }

    spec.input.theme = 'demo';
    spec.input.maxCat = 12;

    // AdaViz does not clean up data table properly
    // so we need to do this trick
    this.refs.chart.innerHTML = '';
    this.refs.chart.__adaviz__ = spec;
    try {
      const AdaViz = (global.AdaViz || global.adaviz && global.adaviz.default);

      AdaViz.render(this.refs.chart, spec, (view) => {
        if (this.props.onLegendClick) {
          view.on('legendClick', (e,d) => {
            this.props.onLegendClick(d);
          });
        }

        if (this.props.onRendered) {
          this.props.onRendered(this.refs.chart);
        }
      });
    } catch (ex) {
      console.log('AdaViz render error: ', ex);
    }
  }

  render() {
    return (<div className='viz-container'><div ref='chart'></div></div>);
  }
}
