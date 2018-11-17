import React, {Component} from 'react'
import InputGroup from "./InputGroup";

export default class ChatWindow extends Component {

    messages() {
        if (this.props.messages) {
            return this.props.messages.map(el =>
                <div className={`message message-${el.direction}`}>{el.text}</div>
            );
        }
    }

    render() {
        return (
            <div className={'messages'}>
                <div className={'message-window'}>
                {this.messages()}
                </div>
                <InputGroup socket={this.props.socket} companion={this.props.companion} newMessage={(mes) => this.props.messageCallback(mes)}/>
            </div>
        );
    }
}