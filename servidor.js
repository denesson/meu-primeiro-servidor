const express = require('express')
const app = express()
app.use(express.json())
const Database = require("better-sqlite3")
const db = new Database("meubanco.db")


app.get('/', (req, res) =>{
    res.send('Meu servidor está rodando')
})

app.get('/usuarios/:nome', (req, res) =>{
    const nome = req.params.nome
    res.send(`Vc buscou pelo usuário: ${nome}`)
})

app.post('/login', (req, res) =>{
    const { email, senha } = req.body
    res.send(`Recebi o login de: ${email}`)
})

app.get('/eventos', (req, res)=>{
    const buscarTodos = db.prepare("SELECT * FROM eventos")
    const eventos = buscarTodos.all()
    res.json(eventos)
})

app.post('/eventos', (req, res) =>{
    const { nome } = req.body
    const inserir = db.prepare("INSERT INTO eventos (nome) VALUES (?)")
    inserir.run(nome)

    const buscarTodos = db.prepare("SELECT * FROM eventos")
    res.json(buscarTodos.all())
})

app.put('/eventos/:id', (req, res) =>{
    const id = Number(req.params.id)
    const { nome } = req.body
    const atualizar = db.prepare("UPDATE eventos SET nome = ? WHERE id = ?")
    atualizar.run(nome, id)

    const buscarTodos =  db.prepare("SELECT * FROM eventos")
    res.json(buscarTodos.all())
})

app.delete('/eventos/:id', (req, res) =>{
    const id = Number(req.params.id)
    const apagar = db.prepare("DELETE FROM eventos WHERE id = ?")
    apagar.run(id)

    const buscarTodos =  db.prepare("SELECT * FROM eventos")
    res.json(buscarTodos.all())
    
})

app.listen(3000, () =>{
    console.log("servidor ligado na porta 3000")
})
