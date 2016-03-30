import React from 'react';
import Modal from './modal';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

const style = {
  textarea: {
    width: '100%',
    height: '120px'
  },
  modalContent: {
    width: '570px'
  }
};

export default class EditTitleModal extends React.Component {
  saveData = () => {
    this.props.onSave(this.refs.title.getValue());
  };

  render() {
    let actions = (
      <div>
        <RaisedButton onClick={this.props.onRequestClose} label='Cancel'/>
        &nbsp;
        <RaisedButton onClick={this.saveData} label='Save' backgroundColor='#2962fd' labelColor='white'/>
      </div>
    );

    return (
      <Modal contentStyle={style.modalContent} open title='Edit Title' onRequestClose={this.props.onRequestClose} actions={actions}>
        <TextField ref='title' defaultValue={this.props.title || 'Untititled Chart'} floatingLabelText='Title' hintText='Please enter title' fullWidth />
      </Modal>
    );
  }
}
