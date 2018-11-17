import React, {Component} from 'react'

export default class UsersColumn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nameInput: false,
            mobileOpen: false
        };
        this.changeName = this.changeName.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    name;

    users() {
        if (this.props.users) {
            return this.props.users.map(el =>
                <li className={`user ${this.props.companion === el ? 'active' : ''}`}><a href={'#'} onClick={() => this.props.userSelection(el)}><img
                    className="icon"/> <div className={'username'}>{el}</div></a></li>
            )
        }
    }

    handleSave(e) {
        this.props.socket.emit('user', {username: this.name, isNew:false});
        this.setState({
            nameInput: false
        })
    }



    changeNameBlock() {
        if (this.state.nameInput) {
            return <div>
                <div>Ваше имя <input onChange={(e) => (this.name = e.target.value)} placeholder={this.props.username}/></div>
                <small><a href={'#'} onClick={this.handleSave}>Сохранить</a></small>
            </div>
        }

        return <div>
            <div>Ваше имя {this.props.username}</div>
            <small><a href={'#'} onClick={this.changeName}>Изменить имя</a></small>
        </div>
    }

    changeName() {
        this.setState({
            nameInput: true
        })
    }

    handleOpen(e) {
        this.setState(ps => ({
            mobileOpen: !ps.mobileOpen
        }))
    }

    render() {
        return (
            <div className={'users-column-wrapper'}>
                <div className="name-block-wrapper">
                {this.changeNameBlock()}
                <button className={'mobile-menu-button'} onClick={this.handleOpen}>Пользователи</button>
                </div>
                <ul hidden={this.state.mobileOpen ? 'hidden' : ''} className={'users-column'}>
                    {this.users()}
                </ul>
            </div>
        );
    }
}
