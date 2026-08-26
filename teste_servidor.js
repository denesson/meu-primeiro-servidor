const express = require('express')
const app = express()
app.use(express.json())
const Database = require("better-sqlite3")
const db = new Database("meubanco.db")
const bcrypt = require("bcryptjs")

app.get("/", (req, res) =>{
    res.send("Servidor rodando...")
})

app.get("/usuario/:nome", (req, res) =>{
    const nome = req.params.nome
    res.send(`O nome que aparece é ${nome}`)
})

app.post("/login", async (req, res) =>{
    const { email, senha } = req.body

    const buscarUsuario = db.prepare("SELCT * FROM usuario WHERE email = ?")
    const usuario = buscarUsuario.get(email)

    if(!usuario){
        return res.status(401).send("Usuario invalido!")
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if(!senhaCorreta){
        return res.status(401).send("Senha incorreta!")
    }
    
    res.send("Login realizado com sucesso.")
})

app.get("/evento", (req, res) =>{
    const buscarTodos = db.prepare("SELECT * FROM eventos")
    const eventos = buscarTodos.all()
    res.json(eventos)
})

app.post("/eventos", (req, res) =>{
    const {nome} = req.body
    const inserir = db.prepare("INSERT INTO eventos (id, nome) VALUES (?, ?)")
    inserir.run(nome)

    const buscarTodos = db.prepare("SELECT * FROM eventos")
    res.send(buscarTodos.all())

})

app.put("/evento/:id", (req, res) =>{
    const id = Number(req.params.id)
    const nome = req.boy
    const atualizar = db.prepare("UPDADE eventos SET nome = ? WHERE id = ?")
    atualizar.all(id, nome)

    const buscarTodos = db.prepare("SELECT * FROM eventos")
    res.send(buscarTodos.all())
})

app.delete("/evento/:id", (req, res) =>{
    const id = Number(req.params.id)
    const apagar = db.prepare("DELETE FROM evento WHERE id = ?")
    apagar.run(id)

    const buscarTodos = db.prepare("SELECT * FROM eventos")
    res.send(buscarTodos.all())
})

app.post("/cadastro", async (req, res) =>{
    const {email, senha } = req.body
    const hash = await bcrypt.hash(senha, 10)
    const inserir = db.prepare("INSERT INTO evento (email, senha) VALUES (?, ?)")
    inserir.run(email, senha)

    const buscarTodos = db.prepare("SELECT * FROM eventos")
    res.send(buscarTodos.all())
})

app.listen(3000, () =>{
    console.log("servidor rodando na porta 3000!")
})