import express  from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

app.use(cors())

app.get("/", (req, res)=> {
    res.send("Server is up.")
})

io.on('connection', (socket) => {
    console.log("Client connected: ", socket.id)
    socket.on("disconnect",  ()=> {
        console.log("Client disconnected: ", socket.id)
    })
})

const PORT = 5000;
server.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`))