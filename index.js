const { application } = require('express')
const express = require('express')
const { json } = require('express/lib/response')

const app = express()
app.use(express.json())

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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const datetime = new Date()
  const responseStr = `<p>Phonebook has info for ${persons.length} people</br></br>${datetime}</p>`

  response.status(200).end(responseStr)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.statusMessage = `No person found for ID ${id}`
    response.status(400).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const lengthBefore = persons.length
  persons = persons.filter(person => person.id !== id)
  if (lengthBefore === persons.length) {
    response.statusMessage = `No person found for if ${id}`
    response.status(400).end()
  } else {
    response.status(204).end()
  }
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
  } else if (persons.some(person => person.name === body.name)) {
    errorJson = { error: `The name already exists in the DB: ${body.name}` }
  }

  if (errorJson) {
    return response.status(400).json(errorJson)
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateRandomId(),
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
