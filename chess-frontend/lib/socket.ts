import {io} from "socket.io-client"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ""
const socket = io(backendUrl)

export default socket