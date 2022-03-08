require('dotenv').config()
const { application } = require('express')
const express = require('express')
const { json } = require('express/lib/response')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// app.use(morgan('tiny'))
morgan.token('reqbody', (req, res) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '-'
})
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :reqbody'
  )
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/info', (request, response) => {
  const datetime = new Date()
  const responseStr = `<p>Phonebook has info for ${persons.length} people</br></br>${datetime}</p>`

  response.status(200).end(responseStr)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log(response)
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => response.json(person))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
})

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0
  return maxId + 1
}

const generateRandomId = () => {
  return Math.floor(Math.random() * (2 ** 31 - 1))
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  let errorJson = null
  if (!body.name) {
    errorJson = { error: 'name missing' }
  } else if (!body.number) {
    errorJson = { error: 'number missing' }
  }
  // else if (persons.some(person => person.name === body.name)) {
  //   errorJson = { error: `The name already exists in the DB: ${body.name}` }
  // }

  if (errorJson) {
    return response.status(400).json(errorJson)
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => response.json(savedPerson))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
