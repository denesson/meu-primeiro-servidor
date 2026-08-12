const Database = require('better-sqlite3')
const db = new Database('meubanco.db')

db.exec(`
        CREATE TABLE IF NOT EXISTS eventos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
        )
    `)

console.log("tabela criada!")

db.exec(`
        CREATE TABLE IF NOT EXISTS participantes(   
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        evento_id INTEGER
        )
    `)

console.log("tabela criada!")

db.exec(`
        CREATE TABLE IF NOT EXISTS reviews(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nota INTEGER,
        evento_id INTEGER
        )
    `)
console.log("Tabela criada")

const inserir = db.prepare('INSERT INTO eventos (nome) VALUES (?)')
inserir.run("Festa na praia")
inserir.run("Show de rock")

console.log("Eventos inseridos!")

const inserirParticipante = db.prepare("INSERT INTO participantes (nome, evento_id) VALUES (?, ?)")
inserirParticipante.run("João", 1)
inserirParticipante.run("Maria", 1)
inserirParticipante.run("Miguel", 2)

const inserirReviews = db.prepare("INSERT INTO reviews (evento_id, nota) VALUES (?, ?)")
inserirReviews.run(1, 5)
inserirReviews.run(2, 3)

const consulta = db.prepare(
    `SELECT participantes.nome, eventos.nome AS evento
    FROM participantes
    JOIN eventos ON participantes.evento_id = eventos.id
    `
)

const consultaReviews = db.prepare(
    `SELECT eventos.nome AS evento, reviews.nota
    FROM reviews
    JOIN eventos ON reviews.evento_id = eventos.id
    `
)

console.log(consulta.all())
console.log(consultaReviews.all())

const buscarTodos = db.prepare("SELECT * FROM eventos")
const eventos =  buscarTodos.all()

console.log(eventos)

/*const apagar = db.prepare("DELETE FROM eventos")*/
/*apagar.run()*/

/*console.log("Duplicados removidos!")*/

/*const atualizar = db.prepare("UPDATE eventos SET nome = ? WHERE id = ?")
atualizar.run("Fetsa na praia(atualizada)", 1)*/

