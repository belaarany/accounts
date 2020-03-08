import clear from "clear"
import { Server } from "~app/server"
import { App } from "~app/app"

clear()

let app: App
let server: Server

app = new App()
app.bootstrap().then(() => {
	server = new Server(app)
	server.listen("@env")
})
