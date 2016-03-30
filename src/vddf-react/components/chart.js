import React from 'react';
import AdaVizChart from './adaviz';
import DropdownMenu from './dropdown-menu';
import DataEditModal from './data-edit-modal';
import ExportModal from './export-modal';
import EditTitleModal from './edit-title-modal';
import ChartSettings from './chart-settings';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FontIcon from 'material-ui/lib/font-icon';
import ReactTooltip from 'react-tooltip';
import Immutable from 'immutable';
import AdaVizHelper from '../helpers/adaviz';
import DataTable from './table';
import Sidebar from './sidebar';

const style = {
  container: {
    margin: '0 auto',
    background: 'white'
  },
  containerActive: {
    margin: '0 auto',
    boxShadow: '0 0 4px 2px rgba(0,0,0,0.1)',
    borderRadius: '4px 4px 0 0',
    background: 'white'
  },
  toolbar: {
    color: '#4A4A4A',
    padding: '8px 10px',
    position: 'relative',
    height: 32
  },
  toolbarActive: {
    borderRadius: '4px 4px 0 0',
    background: '#F1F1F1'
  },
  title: {
    fontSize: '16px',
    color: '#4A4A4A',
    textAlign: 'center'
  },
  toolbarLeft: {
    position: 'absolute',
    left: 16,
    top: 4
  },
  toolbarRight: {
    position: 'absolute',
    right: 18,
    top: 8
  },
  titleIcon: {
    color: '#9B9B9B',
    cursor: 'pointer'
  },
  menuIcon: {
    color: '#9B9B9B',
    fontSize: 20,
    cursor: 'pointer'
  },
  menuItem: {
    paddingLeft: '16px',
    paddingRight: '16px'
  },
  modificationNotice: {
    background: '#FCFCE0',
    fontSize: '0.85em',
    padding: '4px 8px'
  },
  noticeLink: {
    color: 'rgb(29, 170, 241)',
    cursor: 'pointer'
  }
};

export const Handles = {
  UI_TOOLBAR_BUTTONS: 'ui-toolbar-buttons',
  UI_TOOLBAR_MENUS: 'ui-toolbar-menus',
  UI_ACTIVATE_MODAL: 'ui-activate-modal'
};

export default class Chart extends React.Component {
  static defaultProps = {
    width: 750,
    height: 500
  };

  static childContextTypes = {
    baseUrl: React.PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      adaviz: null,
      modal: {},
      showChartSettings: false,
      embedResult: null
    };
  }

  getChildContext() {
    return {
      baseUrl: `${this.props.baseUrl}/`
    };
  }

  get vddf() {
    return this.props.vddf;
  }

  componentDidMount() {
    this.renderChart();
    this.vddf.on('update', this.handleUpdate);

    window.addEventListener('mousedown', this.pageMouseDown);
  }

  shouldComponentUpdate(nextProps) {
    if (this.vddf !== nextProps.vddf) {
      this.vddf.off('update', this.handleUpdate);
      nextProps.vddf.on('update', this.handleUpdate);

      // :( bad
      setTimeout(() => {
        this.renderChart();
      }, 80);
    }

    return true;
  }

  componentWillUnmount() {
    this.vddf.off('update', this.handleUpdate);

    window.removeEventListener('mousedown', this.pageMouseDown);
  }

  getCanvasHeight() {
    let height = this.props.height;

    if (this.props.mode !== 'chartonly') {
      height = height - 32; // header

      // if (this.vddf.isModified()) {
      //   height -= 22; // footer modification notice
      // }
    }

    return height;
  }

  async renderChart() {
    const vddf = this.props.vddf;
    const viz = vddf.visualization;
    let height = this.getCanvasHeight();
    let width = this.props.width;

    if (this.state.showChartSettings) {
      width -= 185;
      height -= 80;
    }

    if (viz.type !== 'datatable') {
      width = Math.min(1000, width);
    }

    const spec = Immutable.fromJS({
      input: {
          ...viz,
        width,
        height
      },
      data: await AdaVizHelper.aggregateData(vddf)
    });

    this.setState({
      adaviz: spec
    });
  }

  getModal(name) {
    switch (name) {
    case 'data':
      return <DataEditModal vddf={this.vddf} onRequestClose={() => this.toggleModal('data')} onSave={this.saveData} />;
    case 'title':
      return <EditTitleModal title={this.vddf.title} onSave={this.saveTitle} onRequestClose={() => this.toggleModal('title')} />;
    case 'export':
      return <ExportModal embed={this.state.embedResult} onRequestClose={() => this.toggleModal('export')} />;
    default:
      return this.vddf.manager.handle(Handles.UI_ACTIVATE_MODAL, name, this);
    }
  }

  toggleModal = (name) => {
    let modal = this.state.modal;

    if (modal[name]) {
      delete modal[name];
    } else {
      modal[name] = this.getModal(name);
    }

    this.setState({modal: modal});
  };

  handleUpdate = () => {
    this.renderChart();
  };

  getActiveModals = () => {
    for (let name in this.state.modal) {
      return this.state.modal[name];
    }
  };

  toggleChartSettings = () => {
    this.setState({
      showChartSettings: !this.state.showChartSettings
    });

    // TODO: optimize this by recalculate the height
    setTimeout(() => {
      this.renderChart();
    }, 80);
  };

  saveData = (data, schema) => {
    this.vddf.updateData(data, schema);
    this.toggleModal('data');
  };

  saveTitle = (title) => {
    this.vddf.title = title;
    this.toggleModal('title');
  };

  exportChart = () => {
    this.vddf.manager.export(this.vddf)
      .then(result => {
        this.setState({
          embedResult: result
        });

        this.toggleModal('export');
      });
  };

  embedChart = () => {
    if (!this.vddf.uuid) {
      this.exportChart();
    } else {
      this.vddf.manager.embed(this.vddf)
        .then(result => {
          this.setState({
            embedResult: result
          });

          this.toggleModal('export');
        });
    }
  };

  revertChange = () => {
    this.vddf.revert();
  };

  shareToExtension = () => {
    const event = new CustomEvent('share-to-extension', {
      detail: { vddf: this.vddf }
    });

    document.dispatchEvent(event);
  };


  getToolbar(active) {
    // TODO: move to a separate component
    let toolbarStyle = Object.assign({}, style.toolbar);

    if (active) {
      toolbarStyle = Object.assign(toolbarStyle, style.toolbarActive);
    }

    // TODO: cache menus
    const menus = [
      // {title: 'Edit title ...', action: () => this.toggleModal('title')},
      {title: 'Send to My Arimo', action: this.shareToExtension}
    ];

    // if (this.vddf.isModified) {
    //   menus.push({title: 'Export ...', action: this.exportChart});
    // } else {
    //   menus.push({title: 'Embed ...', action: this.embedChart});
    // }

    menus.push({title: 'Embed ...', action: this.exportChart});


    // TODO: google spreadsheet ?
    const toolbarButtons = [
      {icon: 'mdi-table-edit', action: () => this.toggleModal('data'), title: 'Edit data ...'}
    ];

    // extension point
    this.vddf.manager.handle(Handles.UI_TOOLBAR_MENUS, menus, this);
    this.vddf.manager.handle(Handles.UI_TOOLBAR_BUTTONS, toolbarButtons, this);

    const menuElements = menus.map((m,i) => (
      <MenuItem key={i} primaryText={m.title} onClick={m.action} />
    ));

    // toolbarButtons.push({icon: 'mdi-share-variant', action: this.exportChart, title: 'Share ...'});

    const buttonElements = toolbarButtons.map((b,i) => {
      return (
        <span data-class='vddf-tip' data-tip={b.title} key={i} style={{ marginLeft: '12px', display: 'inline-block' }}>
          <FontIcon style={style.menuIcon}
                    onClick={b.action}
                    className={'mdi ' + b.icon} />
        </span>
      );
    });

    const chartType = this.vddf.chartType;
    const leftIcons = [
      { icon: 'mdi-table', action: this.switchToTable, active: chartType === 'datatable', title: 'View data' },
      { icon: 'mdi-chart-bar', action: this.switchToChart, active: chartType !== 'datatable', title: 'View chart' }
    ].map((i,k) => {
      return (
        <span key={k} data-tip={i.title} data-class='vddf-tip' style={{display: 'inline-block', marginRight: '18'}}>
          <FontIcon color={i.active ? '#F99400' : null} style={style.titleIcon} className={`mdi ${i.icon}`} onClick={i.action} />
        </span>
      );
    });

    const menu = (
      <span style={{display: 'inline-block', marginLeft: 12}}>
        <DropdownMenu iconStyle={style.menuIcon} icon='mdi-share-variant'>
          {menuElements}
        </DropdownMenu>
      </span>
    );

    if (!active) {
      return (
        <div className='viz-toolbar' style={toolbarStyle}>
          <div style={style.title}>
            {this.vddf.title}
          </div>
        </div>
      );
    } else {
      return (
        <div className='viz-toolbar' style={toolbarStyle}>
          <div style={style.toolbarLeft}>
            {leftIcons}
          </div>
          <div style={style.title}>
            {this.vddf.title}
          </div>
          <div style={style.toolbarRight}>
            {buttonElements}
            {menu}
          </div>
        </div>
      );
    }
  }

  switchToChart = () => {
    if (this.vddf.chartType === 'datatable') {
      this.vddf.chartType = this.vddf.visualization.previousType || this.vddf.getAvailableCharts()[0];

      this.setState({
        showChartSettings: true
      });

      setTimeout(() => {
        this.renderChart();
      }, 80);
    } else {
      this.toggleChartSettings();
    }
  };

  switchToTable = () => {
    // hide chart settings if necessary
    if (this.state.showChartSettings)
      this.toggleChartSettings();

    // also force to table
    this.vddf.chartType = 'datatable';
  };

  getChart() {
    try {
      const input = this.state.adaviz.get('input').toJS();
      const wrapperStyle = {width: this.props.width, overflow: 'hidden'};
      let el;

      if (input.type === 'datatable') {
        // use directly vddf payload to speed up the renderer
        const data = this.vddf.payload.get('data');
        const schema = this.vddf.payload.get('schema');
        const tableWidth = this.props.width;
        const tableHeight = this.getCanvasHeight();

        el = (
          <div style={{margin: '0 auto', width: tableWidth, height: tableHeight}}>
            <DataTable data={data} schema={schema} width={tableWidth} height={tableHeight} />
          </div>
        );
      } else {
        el = (
          <div style={{width: input.width, height: input.height, margin: '0 auto'}}>
            <AdaVizChart spec={this.state.adaviz} onRendered={this.props.onRendered} onLegendClick={this.props.onLegendClick} />
          </div>
        );
      }

      if (this.state.showChartSettings) {
        wrapperStyle.width -= 185;
        wrapperStyle.marginLeft = 185;
      }

      return (
        <div style={wrapperStyle}>
          {this.state.showChartSettings ? <ChartSettings key={1} vddf={this.vddf} /> : null}
          {el}
        </div>
      );
    } catch (ex) { }
  }

  getChartSettings() {
    return (
      <Sidebar vddf={this.vddf} height={this.getCanvasHeight()}></Sidebar>
    );
  }

  getNotificationNotice() {
    // TODO: need a better notification when not in active mode
    // if (this.vddf.isModified() && this.isActive()) {
    //   return (
    //     <div style={style.modificationNotice}>
    //       You have customized this visualization. <span style={style.noticeLink} onClick={this.revertChange}>Revert</span> or <span onClick={this.exportChart} style={style.noticeLink}>Export</span>.
    //     </div>
    //   );
    // }
  }

  activate() {
    if (!this.state.active && !this.props.active) {
      this.setState({
        active: 1
      });
    }
  }

  mouseDown = () => {
    this.isMouseDown = true;
  };

  mouseUp = () => {
    this.isMouseDown = false;
  };

  pageMouseDown = () => {
    if (!this.isMouseDown && this.state.active && !this.props.active) {
      this.setState({active: 0});

      if (this.state.showChartSettings)
        this.toggleChartSettings();
    }
  };

  isActive() {
    return this.props.active || this.state.active;
  }

  render() {
    const active = this.isActive();
    const containerStyle = Object.assign({
      width: this.props.width
    }, active ? style.containerActive : style.container);

    if (this.props.mode === 'chartonly') {
      return (
        <div style={{overflow: 'hidden', height: this.getCanvasHeight()}}>
          {this.state.adaviz && this.getChart()}
        </div>
      );
    }

    if (!active) {
      containerStyle.cursor = 'pointer';
    }

    const view = (
      <div style={containerStyle} onClick={() => this.activate()}
        onMouseDown={this.mouseDown}
        onMouseUp={this.mouseUp}
>
        {this.getToolbar(active)}
        <div style={{overflow: 'hidden', height: this.getCanvasHeight()}}>
          {this.state.showChartSettings && this.getChartSettings()}
          {this.state.adaviz && this.getChart()}
        </div>
        {this.getNotificationNotice()}
        {this.getActiveModals()}
        <ReactTooltip place="bottom" type="dark" effect="solid"/>
      </div>
    );

    return view;
  }
}
