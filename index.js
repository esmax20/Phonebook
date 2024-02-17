require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))

/* let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
] */

var morgan = require('morgan')
morgan.token('cont', function (req) {
  if (req.body.name === undefined) {
    return ""    
  }
  else {
    return (`{"name":"${req.body.name}", "number":"${req.body.number}"}`)
  }
})
morgan.token('type', function (req, res) { return req.headers['content-type'] })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :cont'))


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date().toString()}</p>`)
})
  
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    }
    /* else {
        if ((app.get('/api/persons', (request, response) => {
          Person.find({}).then(persons => {
            response.json(persons)
          })
        })).map(person => person.name).includes(body.name)) {
            return response.status(400).json({ 
                error: `name '${body.name}' already registered` 
              })
        }
    } */

    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
    }
    
    
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})
  

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})