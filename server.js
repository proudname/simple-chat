const express = require('express');
const server = express();
const next = require('next');
const http = require('http').Server(server);
const io = require('socket.io')(http);


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let users = [];

app.prepare()
    .then(() => {
        // подключение к сокету
        io.on('connection', function(socket){
            let userName;
            socket.on('user', function (user) {
                //при событии user валидидация и добавление нового пользователя
                if (user.isNew) {
                    user.username = `User ${socket.id.toString()}`;
                }

                // валидация
                if (users.indexOf(user.username) !== -1 && user.isNew) { socket.emit('err', 'Введенное имя уже существует'); return; }
                if (!(/[a-zA-Z -]/ui.test(user.username)) || !user.username || user.username.length < 3) { socket.emit('err', 'Введено некорректное имя'); return; }

                //если пользователь сменил имя то удаляем старое имя и добавляем новое
                let index = users[users.indexOf(userName)];
                if (userName && index !== -1) {
                    users.splice(index, 1);
                }
                socket.emit('user', user.username);

                users.push(user.username);
                userName = user.username;

                //В конце обновляем список юзеров во всех клиентах
                io.emit('users', {users: users});
            });

            socket.on('new message', function (msg) {
                // просто возвращаем сообщение всем юзерам. В боевом приложении я бы добавил room для каждого чата и отдавал данные только
                // на те клиенты которые участвуют в этом чате
                io.emit('new message', {...msg, from: userName});
            });

            socket.on('disconnect', function(){
                //При дисконнекте убираем юзера и обновляем во всех клиентах
                if (userName && users[users.indexOf(userName)] !== -1) {
                    users.splice(users[users.indexOf(userName)], 1);
                    io.emit('users', {users: users});
                }
            });
        });

        server.get('*', (req, res) => {
            return handle(req, res)
        });


        http.listen(3000, (err) => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack);
        process.exit(1)
    });