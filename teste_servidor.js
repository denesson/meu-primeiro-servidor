const express = require('express')
const app = express()
app.use(express.json())
const Database = require("better-sqlite3")
const db = new Database("meubanco.db")
const bcrypt = require("bcryptjs")

app.get("/", (req, res) =>{
    res.send("Meu servidor está rodando")
})

app.get("/usuario/:nome", (req, res) =>{
    const nome = req.params.nome
    res.send(`Você buscou pelo ${nome}`)
})

app.post("/login", (req, res)=>{
    const {email, senha} = req.body
    res.send(`Recebi o login ${email}`)
})

app.get("/eventos", (req, res)=>{
    const buscarTodos = db.prepare("SELECT * FROM eventos")
    const eventos = buscarTodos.all()
    res.json(eventos)
})

app.listen(3000, () =>{
    console.log("Servidor ligado na porta 3000")
})