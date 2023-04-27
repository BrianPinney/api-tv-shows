import functions from 'firebase-functions'
import express from 'express'
import cors from 'cors'
import { login, signup } from './src/users.js'
import { addShow, getShows } from './src/shows.js'

const app = express()
app.use(cors())
app.use(express.json())

app.post("/signup", signup)
app.post("/login", login)

app.post("/shows", addShow)
app.get("/shows", getShows)

app.listen(3000, () => console.log(`Listening on http://localhost:3000...`))

export const api = functions.https.onRequest(app)
