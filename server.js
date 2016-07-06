'use strict';

const express = require('express')
const socketIO = require('socket.io')
const path = require('path')
const bodyParser = require('body-parser')

const INDEX = path.join(__dirname, 'index.html')

const app = express()
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server)

io.on('connection', socket => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
    setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
})

const router = express.Router()

router.use((req, res, next) => {
    next();
})

let x = 0

router.post('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our api!' });
    console.log(req.body)
    io.emit('test', JSON.stringify(req.body))   
})

app.use('/api', router)

app.get('/', (req, res) => {
    res.sendFile(INDEX)
})