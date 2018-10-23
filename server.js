const express = require('express');
const next = require('next');
const keys = require('./config/keys');
const mongoose = require('mongoose');


mongoose.connect(keys.mongo_url);



const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const cookieSession = require('cookie-session');

app.prepare()
    .then(() => {
        const server = express();

        server.use(cookieSession({
            maxAge: 60*60*24*30*1000,
            keys: ['yellowCats']
        }));

        server.get('*', (req, res) => {
            return handle(req, res)
        });


        server.listen(3000, (err) => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack);
        process.exit(1)
    });