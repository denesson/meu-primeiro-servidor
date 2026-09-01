const express = require('express')
const app = express()
app.use(express.json())
const Database = require("better-sqlite3")
const db = new Database("meubanco.db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv').config()

app.get('/', (req, res) =>{
    res.send('Meu servidor está rodando')
})

app.get('/usuarios/:nome', (req, res) =>{
    const nome = req.params.nome
    res.send(`Vc buscou pelo usuário: ${nome}`)
})


app.get('/eventos', async (req, res)=>{
    const eventos = await prisma.evento.findMany()
    res.json(eventos)
})

app.post('/eventos', async (req, res) =>{
    const { nome } = req.body
    const inserir = await prisma.evento.create({data: {nome: nome}})
    
    const eventos = await prisma.evento.findMany()
    res.json(eventos)
})

app.put('/eventos/:id', async (req, res) =>{
    const id = Number(req.params.id)
    const { nome } = req.body
    const atualizar = await prisma.evento.update({where: {id: id}, data: {nome: nome}})
    
    const eventos = await prisma.evento.findMany()
    res.json(eventos)
})

app.delete('/eventos/:id', async (req, res) =>{
    const id = Number(req.params.id)
    const apagar = await prisma.evento.delete({where: {id: id}})

    const eventos = await prisma.evento.findMany()
    res.json(eventos)
    
})

app.post('/cadastro', async (req, res)=>{
    const {email, senha} = req.body
    const hash = await bcrypt.hash(senha, 10)
    const inserir = await prisma.usuario.create({data: {email: email, senha: hash}})
    res.send('Usuario cadastrado com sucesso!')
})

app.post("/login", async (req, res) =>{
    const {email, senha} = req.body

    const Usuario = await prisma.usuario.findUnique({where: {email: email}})

    if(!usuario) {
        return res.status(401).send("usuario não encontrado")
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if(!senhaCorreta){
        return res.status(401).send("senha incorreta")
    }

    const token = jwt.sign(
        {id: usuario.id, email: usuario.email},
        process.env.JWT_SECRET,
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

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) =>{
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
