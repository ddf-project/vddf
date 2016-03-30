import React from 'react';

const style = {
  container: {
    overflow: 'auto',
    margin: '0 auto',
    padding: '0 0 8px 0'
  },

  table: {
    borderCollapse: 'collapse',
    border: 0,
    width: '100%'
  },

  fixedHeaderTable: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    borderCollapse: 'collapse',
    border: 0,
    background: 'white'
  },

  thead: {
  },

  th: {
    margin: 0,
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: '1px solid #DDDDDD',
    textAlign: 'left',
    fontSize: '14px',
    color: '#4A4A4A',
    padding: '7px 16px'
  },

  td: {
    color: '#4A4A4A',
    padding: '7px 16px',
    margin: 0,
    whiteSpace: 'nowrap',
    textAlign: 'left',
    fontSize: '14px',
    border: '0'
  },

  even: {
    background: '#FAFAFA'
  }
};

export default class DataTable extends React.Component {

  shouldComponentUpdate(nextProps) {
    const toUpdate = nextProps.data !== this.props.data
            && this.props.schema !== this.props.schema;

    return toUpdate;
  }

  componentDidMount() {
    setTimeout(() => {
      this.updateColumnWidth();
    }, 200);
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.updateColumnWidth();
    }, 200);
  }

  updateColumnWidth() {
    const header = this.refs.theadRow;
    const fixedHeadRow = this.refs.fixedHeadRow;
    const container = this.refs.container;
    const tableContainer = this.refs.tableContainer;

    let totalWidth = 0;
    //let scrollbarWidth = tableContainer.offsetWidth - tableContainer.clientWidth;

    // set all the width
    for (let i = 0; i < header.children.length; i++) {
      const cellWidth = header.children[i].offsetWidth;

      fixedHeadRow.children[i].style.width = cellWidth + 'px';
      header.children[i].style.width = cellWidth + 'px';

      totalWidth += cellWidth;
    }

    // now show the new header
    this.refs.fixedHeader.style.display = 'block';

    // set width
    this.refs.fixedHeader.style.width = totalWidth + 'px';
    // this.refs.tableContainer.style.width = totalWidth;
    // this.refs.tableContainer.style.height = this.props.height - (container.offsetHeight - container.clientHeight);
  }

  onScroll = (e) => {
    const target = e.target;
    this.refs.fixedHeader.style.left = -target.scrollLeft;
  };

  render() {
    const data = this.props.data.toJS();
    const schema = this.props.schema.toJS();
    const width = this.props.width;
    const height = this.props.height;

    const head = schema.map((c,i) => {
      return <th key={i} style={style.th}>{c.name}</th>;
    });

    const limit = data.length; // TODO: implement paging

    const body = data.slice(0, limit).map((c,j) => {
      const tds = c.map((v,i) => {
        let tdStyle = {...style.td};

        if (j % 2 == 0) {
          tdStyle = Object.assign(tdStyle, style.even);
        }

        return <td style={tdStyle} key={i}>{v ? v + '' : ''}</td>;
      });

      return <tr key={j}>{tds}</tr>;
    });

    return (
      <div>
        <div ref='container' style={{position: 'relative', overflow: 'hidden', width, height}}>
          <table ref='fixedHeader' className='vddf-table' style={{...style.fixedHeaderTable, display: 'none'}}>
            <thead><tr ref='fixedHeadRow' style={style.thead}>{head}</tr></thead>
          </table>
          <div onScroll={this.onScroll} ref='tableContainer' style={{height: this.props.height, overflow: 'auto'}}>
          <table className='vddf-table' style={style.table}>
            <thead><tr ref='theadRow' style={style.thead}>{head}</tr></thead>
            <tbody>{body}</tbody>
          </table>
          </div>
        </div>
      </div>
    );
  }
}
