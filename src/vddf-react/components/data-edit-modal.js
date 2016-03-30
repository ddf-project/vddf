import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import ReactDataGrid, { Toolbar } from 'react-data-grid/addons';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Modal from './modal';

const style = {
  modal: {
    width: '95%',
    maxWidth: 'auto'
  },
  toolbarContainer: {
    textAlign: 'right',
    marginBottom: '5px'
  }
};

export default class DataEditModal extends React.Component {
  static propTypes = {
    vddf: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      columns: []
    };
  }

  componentDidMount() {
    require('react-data-grid/themes/react-data-grid.css');
    let vddf = this.props.vddf;

    const columns = vddf.schema.map((c,i) => {
      return {
        name: c.name,
        type: c.type,
        key: String(i),
        editable: true
      };
    });

    this.setState({
      rows: vddf.fetch().concat([this.newRow()]),
      columns: columns
    });
  }

  newRow() {
    return this.state.columns.reduce((obj, value, index) => {
      return obj.concat(['']);
    }, []);
  }

  handleRowUpdate = (e) => {
    let rows = this.state.rows;

    // data grid always pass as string, so we do double check to convert back to number
    Object.keys(e.updated).forEach(i => {
      if (/^-?\d+(\.\d+)?$/.test(e.updated[i])) {
        e.updated[i] = parseFloat(e.updated[i]);
      }
    });

    Object.assign(rows[e.rowIdx], e.updated);

    // if user is editing the last row, and it is not empty then add new placeholder row
    if (e.rowIdx === rows.length - 1 && rows[e.rowIdx].join('') !== '') {
      rows.push(this.newRow());
    }

    this.setState({rows: rows});
  };

  handleAddRow = (e) => {
    let rows = this.state.rows;
    let row = this.newRow();

    rows.push(row);

    this.setState({
      rows: rows
    });
  };

  handleAddColumn = (e) => {
    // TODO: need better UX
    let columnName = prompt('Please enter column name');
    let columns = this.state.columns;

    // check if column exist
    const hasColumn = columns.some(c => c.name == columnName);

    if (hasColumn) {
      alert('Column name is taken');
    } else if (columnName) {
      this.setState({
        columns: columns.concat({
          name: columnName,
          key: columns.length,
          editable: true
        })
      });
    }
  };

  getRow = (i) => {
    return this.state.rows[i].reduce((obj, value, index) => {
      return Object.assign(obj, {
        [index]: typeof(value) !== 'object' ? value : value+''
      });
    }, {});
  };

  saveData = () => {
    let schema = this.state.columns.map(c => {
      return {
        name: c.name,
        type: c.type
      };
    });

    // skip the last row, because it's just placeholder
    this.props.onSave(this.state.rows.slice(0, this.state.rows.length - 1), schema);
  };

  getActions() {
    return (
      <div>
        <RaisedButton onClick={this.props.onRequestClose} label='Cancel'/>
        &nbsp;
        <RaisedButton onClick={this.saveData} label='Save' backgroundColor='#2962fd' labelColor='white'/>
      </div>
    );
  }

  getToolbar() {
    return (
      <div style={this.toolbarContainer}>
        <FlatButton onClick={this.handleAddRow} label="Add Row"/>
        <FlatButton onClick={this.handleAddColumn} label="Add Column"/>
      </div>
    );
  }

  render() {
    if (this.state.columns.length == 0) {
      return (<div></div>);
    }

    // TODO: detect height by window height
    return (
      <Modal contentStyle={style.modal} open autoDetectWindowHeight actions={this.getActions()} title='Edit Data'  onRequestClose={this.props.onRequestClose}>
        {this.getToolbar()}
        <ReactDataGrid
           columns={this.state.columns}
           rowsCount={this.state.rows.length}
           rowGetter={this.getRow}
           onRowUpdated={this.handleRowUpdate}
           enableCellSelect={true}
           minHeight={400} />
      </Modal>
    );
  }
}
