import React from 'react';
import ReactDOM from 'react-dom';
import Paper from 'material-ui/lib/paper';
import Menu from 'material-ui/lib/menus/menu';
import FontIcon from 'material-ui/lib/font-icon';

const style = {
  root: {
    position: 'relative',
    display: 'inline-block'
  },
  toggleIcon: {
    color: '#cecece',
    fontSize: 18,
    cursor: 'pointer',
    marginRight: '4px'
  },
  popover: {
    position: 'absolute',
    top: '100%',
    right: 0,
    zIndex: 10
  },
  paper: {
    minWidth: 120
  }
};

export default class Popover extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string,
    iconStyle: React.PropTypes.object,
    paperStyle: React.PropTypes.object,
    onRequestClose: React.PropTypes.func
  };

  static defaultProps = {
    icon: 'keyboard_arrow_down'
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleDocumentClick = (event) => {
    if (event.target && this.state.open) {
      let elem = ReactDOM.findDOMNode(this.refs.root);

      if (elem !== event.target && !elem.contains(event.target)) {
        const shouldClose = !this.props.onRequestClose || this.props.onRequestClose();

        if (shouldClose) {
          this.toggle();
        }
      }
    }
  };

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  getPopover() {
    let paperStyle = {...style.paper, ...this.props.paperStyle};

    return (
        <div style={style.popover}>
        <Paper>
          <div style={paperStyle}>
           {this.props.children}
          </div>
        </Paper>
        </div>
    );
  }

  render() {
    const iconStyle = this.props.iconStyle || style.toggleIcon;

    return (
      <div ref='root' style={style.root}>
        <FontIcon onClick={this.toggle} style={iconStyle} className={'mdi ' + this.props.icon}/>
        {this.state.open && this.getPopover()}
      </div>
    );
  }
}
