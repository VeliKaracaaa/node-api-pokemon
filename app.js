const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const { success, getUniqueId } = require('./helper')
let pokemons = require('./mock-pokemon')

const app = express()
const port = 3000

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())
app.get('/', (req, res) => res.send('Hello, Express !'))
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    const message = 'Un pokémon a bien été trouvé'
    res.json(success(message, pokemon    ))
})
app.get('/api/pokemons', (req, res) => {
    const message = `Il y a ${pokemons.length} pokémons dans le pokédex pour le moment`
    res.json(success(message, pokemons))
})
app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = {...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokémon ${pokemonCreated.name} a bien été crée`
    res.json(success(message, pokemonCreated))
})
app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonUpdate = {...req.body, id: id}
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdate : pokemon
    })
    const message = `Le pokémon ${pokemonUpdate.name} a bien été modifié`
    res.json(success(message, pokemonUpdate))
})
app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons.filter(pokemon => pokemon.id !== id)
    const message = `le pokemon ${pokemonDeleted.name} a bien été supprimé`
    res.json(success(message, pokemonDeleted))
})
app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))