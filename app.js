const express = require('express')
const bodyParser = require('body-parser')
const { Sequelize, DataType, DataTypes} = require('sequelize')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const { success, getUniqueId } = require('./helper')
let pokemons = require('./mock-pokemon')
const PokemonModel = require('./src/models/pokemon')

const app = express()
const port = 3000

const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
)
sequelize.authenticate()
    .then(_ => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))

const Pokemon = PokemonModel(sequelize, DataTypes)

sequelize.sync({force: true})
    .then(_ => {
        console.log('La base de données "Pokédex" a bien été synchronisée.')
        pokemons.map(pokemon => {
             Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types.join(),
            }).then(bulbizzare => console.log(bulbizzare.toJSON()))
        })
    })
    .catch(error => console.error(`Impossible de synchroniser la base de données ${error}`))

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