const express = require("express")
const path = require("path")
const app = express()
const http = require("http")
const server = http.createServer(app)
const socketio = require("socket.io")
const io = socketio(server)
const Filter = require("bad-words")
const {
    addUser,
    getUser,
    removeUser,
    getUsersInGroup
} = require("./utils/users")
const { generateMessage, generateLocation } = require("./utils/messages")


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, "../public")
app.use(express.static(publicDirectoryPath))


//server(emit)-->client(recieve) --countUpdated
//client(emit)-->server(recieve) --increment
io.on('connection', (socket) => {
    console.log("new websocket connection")
        //socket.emit() , socket.broadcast.emit() , io.emit(), socket.broadcast.to().emit(), io.to().emit()
    socket.on('join', ({ username, group }, callback) => {

        const { error, user } = addUser({ id: socket.id, username, group })
        if (error) {
            return callback(error)
        }
        socket.join(user.group)
        socket.emit('message', generateMessage("Welcome!", "Admin"))
        socket.broadcast.to(user.group).emit("message", generateMessage(`${user.username} joined ${user.group}!`))
        io.to(user.group).emit('groupData', {
            group: user.group,
            users: getUsersInGroup(user.group)
        })
        callback()
    })
    socket.on('displayMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.group).emit("message", generateMessage(message, user.username))
        callback()
    })

    socket.on("sendLocation", (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.group).emit("locationMessage", generateLocation(`https://www.google.com/maps?q=${location.lat},${location.long},`, user.username)) // we can generate also generate a link here
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.group).emit('message', generateMessage(`${user.username} left!`))
            io.to(user.group).emit('groupData', {
                group: user.group,
                users: getUsersInGroup(user.group)
            })
        }
    })
})
server.listen(port, () => {
    console.log("server is up at-" + port)
})