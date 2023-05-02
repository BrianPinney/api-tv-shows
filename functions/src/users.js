import { FieldValue } from "firebase-admin/firestore";
import  jwt  from "jsonwebtoken";
import { db } from "./dbConnect.js";
import { secretKey } from "../secrets.js";

const coll = db.collection('users')

export async function signup(req, res){
const {email, password} = req.body
if(!email || password.length < 6) {
    res.status(400).send({ message: "Email and Password are both required."})
    return
}
const newUser = {
    email: email.toLowerCase(),
    password,
    createdAt: FieldValue.serverTimestamp(),
    }
    await coll.add(newUser)
    login(req, res)
}

export async function login(req, res){
    const {email, password} = req.body
    if(!email || !password) {
        res.status(400).send({ message: "Email and Password are both required."})
        return
    }
    const users = await coll
    .where('email', '==', email.toLowerCase())
    .where('password', '==', password)
    .get()
    let user = users.docs.map(doc => ({...doc.data(), id: doc.id}))[0]
    if(!user) {
        res.status(400).send({ message: 'Invalid email. and/or password.'})
        return
    }
    delete user.password
    const token = jwt.sign(user, secretKey)
    res.send({user, token})
}
