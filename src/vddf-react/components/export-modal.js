import React from 'react';
import Modal from './modal';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

const style = {
  textarea: {
    width: '100%',
    height: '100px',
    fontSize: '1em'
  },
  modalContent: {
    width: '570px'
  }
};

export default class ExportModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'link'
    };
  }

  render() {
    let code = '';

    switch (this.state.mode) {
    case 'link':
      code = this.props.embed.link;
      break;
    case 'image':
      code = this.props.embed.image;
      break;
    default:
      code = this.props.embed.embedCode;
    }

    const menuItems = [
      { text: 'Link', payload: 'link' },
      { text: 'HTML', payload: 'html' },
      { text: 'Image', payload: 'image' }
    ];

    return (
      <Modal contentStyle={style.modalContent} open title='Export Chart' onRequestClose={this.props.onRequestClose}>
        <p style={{marginBottom: 0}}>Please use the below code to embed the chart:</p>
        <SelectField
          value={this.state.mode}
          onChange={(event, index, item) => this.setState({mode: item.payload})}
          floatingLabelText="Mode"
          menuItems={menuItems}
          />
        <textarea readOnly value={code} style={style.textarea} />
      </Modal>
    );
  }
}
