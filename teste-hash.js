const bcrypt = require('bcryptjs')

async function testar() {
  const senha = "123456"
  const hash = await bcrypt.hash(senha, 10)
  console.log("Hash gerado:", hash)

  const confere = await bcrypt.compare("123456", hash)
  console.log("Senha confere?", confere)

  const confereErrada = await bcrypt.compare("outraSenha", hash)
  console.log("Senha errada confere?", confereErrada)
}

testar()
