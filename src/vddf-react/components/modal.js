import React from 'react';
import Dialog from 'material-ui/lib/dialog';

const style = {
  dialog: {
    header: {
      background: '#2962fd',
      height: '48px',
      lineHeight: '48px',
      textAlign: 'center',
      color: 'white'
    },
    body: {
      padding: 0
    },
    footer: {
      padding: '4px',
      textAlign: 'right'
    }
  }
};

export default class Modal extends React.Component {
  render() {
    let { title, actions, ...rest } = this.props;

    return (
      <Dialog bodyStyle={style.dialog.body} {...rest}>
        <div style={style.dialog.header}>{title}</div>
        <div style={{margin: '8px'}}>
          {this.props.children}
        </div>
        <div style={style.dialog.footer}>
          {actions}
        </div>
      </Dialog>
    );
  }
}
