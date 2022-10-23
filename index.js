const { request } = require("express")
const express = require("express")
const app = express()
var cors = require('cors')
var morgan = require('morgan')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('tpe',(req,res) =>{
    console.log(req.body);
    return req.body
})
app.use(morgan(function(token,req,res){
    return [
        token.method(req,res),
        token.url(req,res),
        token.status(req,res),
        token.tpe(req,res)
    ]

}))
let notes =[
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
]
app.get('/api/persons',(request,response) =>{
    response.json(notes)
})

app.get('/info',(request,response) =>{
    let test= "<h1>Phonebook has info for "+notes.length +" people</h1>"
    let date=new Date()
    response.send(test+date)
})
app.get('/api/persons/:id',(request,response) =>{
    let id = Number(request.params.id)
    let note = notes.find((note)  =>{return note.id===id})
    if (note) {
    return response.json(note)
    }
    else {
        return response.status(404).end()
    }
})
app.delete('/api/persons/:id',(requests,response)=>{
    const id = Number(requests.params.id)
     notes = notes.filter((note)=>{
        console.log(note.id !== id)
        return note.id !== id
    })
    console.log(notes);
    response.status(204).end()
})
app.post("/api/persons/",(request,response)=>{
    let note = {
        id:Math.floor(Math.random()*1000),
        name:request.body.name,
        number:request.body.number
    }
    if (request.body.name && request.body.number){
    const duplicate_name = notes.find((note) => {
        console.log(note.name===request.body.name);
        return note.name===request.body.name
    })
    console.log("duplicate_name",duplicate_name);
    if (duplicate_name){
        response.status(404)
        response.json({error:"duplicate name"})
    }
    notes = notes.concat(note)
    response.json(note)
    response.status(200).end()
    }
    else {
        response.status(404)
        response.json({error:"name or number missing"})
    }
})
const PORT =  process.env.PORT || 3001
app.listen(PORT)    