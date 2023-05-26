const express = require('express');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json())
app.use(cors())
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let phonebook = [
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
];

app.get('/api/persons', (request, response) => {
    response.json(phonebook);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const helper = phonebook.find(p => p.id === id);
    if(helper) {
        response.json(helper);
    }else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    phonebook = phonebook.filter(p => p.id !== id);

    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const {name , number} = request.body;

    if(!name || !number) {
        response.status(404).end();
    }

    const helper = phonebook.find(p => p.name === name);

    if(helper) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: phonebook.length + 1,
        name: name,
        number: number,
    }

    phonebook = phonebook.concat(person)

    response.json(person);
})

app.get('/info', (request, response) => {
    response.send(
        `
        <div>
            <p>Phone book has info for ${phonebook.length} people</p>
            <p>${new Date().toUTCString()}</p>
        </div>
        `
    )
});

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)