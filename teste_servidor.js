const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

await prisma.evento.create({data: {nome: "Show"} })

await prisma.evento.findMany()

await prisma.evento.findUnique({where: { id: 1} })

await prisma.evento.update({
    where: {id: 1},
    data:{nome: "Novo nome"}
})

await prisma.evento.delete({Where: {id: 1}})


