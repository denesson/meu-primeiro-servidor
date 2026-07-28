const express = require('express')
const app = express()

app.get('/', (req, res) =>{
    res.send('Meu servidor está rodando')
})

app.listen(3000, () =>{
    console.log("servidor ligado na porta 3000")
})
