import React, {Component} from 'react'
import UsersColumn from '../src/components/UsersColumn'
import ChatWindow from '../src/components/ChatWindow'
import io from 'socket.io-client'
import '../assets/app.sass'
import Head from 'next/head'

export default class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            users: null,
            activeCompanion: null,
            messages: {}

        };

    }

    socket;

    componentDidMount() {
        // делаю привязку
        let t = this;
        this.socket = io();

        // обрабатываем сессию юзера, получаем username
        if (!sessionStorage.name) this.socket.emit('user', { username: null, isNew: true });
        else   this.socket.emit('user', { username: sessionStorage.name, isNew: false });


        //обработка поступившего сообщения
        this.socket.on('new message', function (res) {
            let tempMessages = {...t.state.messages};
            switch (t.state.username) {
                case res.from: {
                    tempMessages[res.to] ? tempMessages[res.to].push({  direction:'right', text: res.text }) : tempMessages[res.to] = [{  direction:'right', text: res.text }];
                    t.setState({
                        messages: tempMessages
                });
                    break;
                }
                case res.to: {
                    tempMessages[res.from] ? tempMessages[res.from].push({  direction:'left', text: res.text }) : tempMessages[res.from] = [{  direction:'left', text: res.text }];
                    t.setState({
                        messages: tempMessages
                    });
                    break;
                }
                }
        });

        //обновление списка пользователей
        this.socket.on('users', function (res) {
            let index = res.users.indexOf(t.state.username);
            if (index !== -1) res.users.splice(index, 1);
            t.setState((ps) => ({
                users: res.users,

                //если нет собеседника, по умолчанию ставим первого из списка
                activeCompanion: ps.activeCompanion ? ps.activeCompanion : res.users[0]
            }));
        });

        //обновляем данные пользователя
        this.socket.on('user', function (res) {
            t.setState({
                username: res
            });
            sessionStorage.name = res;
        });

        this.socket.on('err', function (res) {
            alert(res)
        });


    }




    userSelection(user) {
        if (this.state.activeCompanion === user) return;
            this.setState({
                activeCompanion: user
            })
    }

    render() {
        return (
            <div className={'layout'}>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <UsersColumn socket={this.socket} username={this.state.username} companion={this.state.activeCompanion} userSelection={(user) => this.userSelection(user)} users={this.state.users} />
                <ChatWindow socket={this.socket} messages={this.state.messages[this.state.activeCompanion]} companion={this.state.activeCompanion} messageCallback={(mes) => this.handleNewMessage(mes)} />
            </div>
        );
    }
}
