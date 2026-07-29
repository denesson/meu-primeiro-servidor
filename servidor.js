const express = require('express')
const app = express()
app.use(express.json())

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

app.listen(3000, () =>{
    console.log("servidor ligado na porta 3000")
})
