import React, { Component } from 'react';
import io from 'socket.io-client'


export default class InputGroup extends Component {


    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    text;

    handleText(e) {
        this.text = e.target.value;
    }

    handleEnter(e) {
        if (e.key === 'Enter') {
            this.handleSubmit(e)
        }
    }

    handleSubmit(e) {

                this.props.socket.emit('new message', {
                    to: this.props.companion,
                    from: sessionStorage.name,
                    text: this.text
                });
                e.target.value = '';
    }

    render() {
        return (
            <div className={'input-group'}>
                <input onChange={this.handleText} onKeyPress={this.handleEnter} className={'message-input'} type="text"/>
                <input onClick={this.handleSubmit} className={'submit-button'} type="submit" value={'Отправить'}/>
            </div>
        );
    }

}