import fastify from 'fastify'
import crypto from 'node:crypto'
import { db } from './database/cliente.js'
import { courses } from './database/schema.js'
import { eq } from 'drizzle-orm'

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})
/*
const courses = [
  { id: '1', title: 'Curso de Node.js' },
  { id: '2', title: 'Curso de React' },
  { id: '3', title: 'Curso de React Native' },
]
*/
server.get('/courses', async(request, reply) => {
  try {
    const result = await db.select({
      id: courses.id,
      title: courses.title,
    }).from(courses)
    return reply.send({ courses: result })
  } catch (error) {
    console.error('Erro ao buscar cursos:', error)
    return reply.status(500).send({ error: 'Erro interno do servidor' })
  }
})

server.get('/courses/:id', async (request, reply) => {
  type Params = {
    id: string
  }

  const params = request.params as Params
  const courseId = params.id

  try {
    const result = await db
                    .select()
                    .from(courses)
                    .where(eq(courses.id, courseId))

    if (result.length > 0) {
      return reply.send({ course: result[0] })
    } 

    return reply.status(404).send({ error: 'Curso não encontrado' })
    
  } catch (error) {
    console.error('Erro ao buscar curso:', error)
    return reply.status(500).send({ error: 'Erro interno do servidor' })
  }




  
})
 /*
server.post('/courses', (request, reply) => {
  type Body = {
    title: string
  }

  const courseId = crypto.randomUUID()

  const body = request.body as Body
  const courseTitle = body.title

  if (!courseTitle) {
    return reply.status(400).send({ message: 'Título obrigatório.' })
  }

  courses.push({ id: courseId, title: courseTitle })

  return reply.status(201).send({ courseId })
})
*/


server.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
}).catch((err) => {
  console.error('Erro ao iniciar servidor:', err)
  process.exit(1)
})