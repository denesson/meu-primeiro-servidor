const express = require('express')
const app = express()
app.use(express.json())
let eventos = [
  { id: 1, nome: "Festa na praia" },
  { id: 2, nome: "Show de rock" }
]

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
    res.json(eventos)
})

app.post('/eventos', (req, res) =>{
    const { nome } = req.body
    const novoEvento = {id: eventos.length + 1, nome: nome}
    eventos.push(novoEvento)
    res.json(eventos)
})

app.put('/eventos/:id', (req, res) =>{
    const id = Number(req.params.id)
    const { nome } = req.body
    for(let i = 0; i < eventos.length; i++){
        if(eventos[i].id === id){
            eventos[i].nome = nome
        }
    }
    res.json(eventos)
})

app.delete('/eventos/:id', (req, res) =>{
    const id = Number(req.params.id)
    eventos = eventos.filter( eventos => eventos.id !== id)

    res.json(eventos)
})

app.listen(3000, () =>{
    console.log("servidor ligado na porta 3000")
})
