const express = require('express')
const app = express()
app.use(express.json())
const Database = require("better-sqlite3")
const db = new Database("meubanco.db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

app.get('/', (req, res) =>{
    res.send('Meu servidor está rodando')
})

app.get('/usuarios/:nome', (req, res) =>{
    const nome = req.params.nome
    res.send(`Vc buscou pelo usuário: ${nome}`)
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

app.post('/cadastro', async (req, res)=>{
    const {email, senha} = req.body
    const hash = await bcrypt.hash(senha, 10)
    const inserir = db.prepare("INSERT INTO usuarios (email, senha) VALUES (?, ?)")
    inserir.run(email, hash)
    res.send('Usuario cadastrado com sucesso!')
})

app.post("/login", async (req, res) =>{
    const {email, senha} = req.body

    const buscarUsuario = db.prepare('SELECT * FROM usuarios WHERE email = ?')
    const usuario = buscarUsuario.get(email)

    if(!usuario) {
        return res.status(401).send("usuario não encontrado")
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if(!senhaCorreta){
        return res.status(401).send("senha incorreta")
    }

    const token = jwt.sign(
        {id: usuario.id, email: usuario.email},
        "minha_chave_secreta",
        {expiresIn: '1h'}
    )

    res.json({mensagem: "Login realizado com sucesso!", token: token})
})

app.get('/perfil', verificarToken, (req, res) =>{
    res.json({mensagem: `Você está logado com ${req.usuario.email}` })
})

function verificarToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).send("Token não fornecido")
    }

    jwt.verify(token, "minha_chave_secreta", (err, usuario) =>{
        if(err){
            return res.status(403).send("token inválido")
        }
        req.usuario = usuario
        next()
    })
}

app.listen(3000, () =>{
    console.log("servidor ligado na porta 3000")
})
