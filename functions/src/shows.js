import { FieldValue } from "firebase-admin/firestore";
import jwt from "jsonwebtoken"
import { db } from "./dbConnect.js";
import { secretKey } from "../secrets.js";


const coll = db.collection('shows')

export async function getShows(req ,res){
    const showsCollection = await coll.get()
    const shows = showsCollection.docs.map(doc => ({...doc.data(), id: doc.id}))
    res.send(shows)
}

export async function addShow(req, res){
    const token = req.headers.authorization
    if (!token) {
        res.status(401).send({message: "Unauthorized. A valide token is required."})
        return
    }
    const decoded = jwt.verify(token, secretKey)
    if (!decoded) {
        res.status(401).send({message: "A valid token is required"})
        return
    }
    const {title, poster, seasons} = req.body
    if(!title || !poster || !seasons){
        res.status(400).send({message: "Show title is required."})
        return
    }
    const newShow = {
        title,
        poster,
        seasons,
        createdAt: FieldValue.serverTimestamp()
    }
    await coll.add(newShow)
    getShows(req, res)
}