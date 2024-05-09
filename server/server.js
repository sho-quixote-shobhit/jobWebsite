const express = require('express')
const app = express();
const cors = require('cors')
const port = 5000

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const morgan = require('morgan')

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on('connected', ()=>{
    console.log('connected to database')
})
mongoose.connection.on('error' , ()=>{
    console.log('connection failed')
})

app.use(morgan('dev'))
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(express.json())
app.use('/files' , express.static('files'))

//routes
const authRoutes = require('./routes/auth')
app.use('/auth' , authRoutes);
const userRoutes = require('./routes/userRoutes')
app.use('/user', userRoutes);
const jobRoutes = require('./routes/jobRoutes')
app.use('/job' , jobRoutes)
const chatRoutes = require('./routes/chatRoutes')
app.use('/chat' , chatRoutes)
const messageRoutes = require('./routes/messageRoutes')
app.use('/message' , messageRoutes)


const server = app.listen(port, () => {
    console.log(`server running at ${port}`)
})

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000 '
    },
    pingTimeout: 60000
})

io.on('connection', (socket) => {

    //user opens the application we setup the socket connection
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log(`user joined the room ${room}`)
    })

    socket.on('new message', (newmessageReceived) => {
        var chat = newmessageReceived.chat
        if (!chat.users) return console.log('chat.users not defined')

        chat.users.forEach(user => {
            if (user._id === newmessageReceived.sender._id) return;
            socket.in(user._id).emit('message received', newmessageReceived)
        });
    })

    socket.on('typing', (room) => {
        socket.in(room).emit('typing', room)
    })

    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing', room)
    })

    socket.off('setup', (userData) => {
        console.log('user disconnected')
        socket.leave(userData._id)
    })
})