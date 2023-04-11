const express = require('express')
const { success } = require('./helper')
let pokemons = require('./mock-pokemon')

const app = express()
const port = 3000

// const logger = (req, res, next) => {
//     console.log(`URL: ${req.url}`)
//     next()
// }
app.use((req, res, next) => {
    console.log(`URL: ${req.url}`)
    next()
})
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
app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))