const { Pokemon } = require('../db/sequelize')

module.exports = (app) => {
    app.get('/api/pokemons', (req, res) => {
        Pokemon.findAll()
            .then(pokemon => {
                const message = 'La liste des pokémons a bien été récupérée.'
                res.json({ message, data: pokemon })
            })
            .catch(error => {
                const message =  `La liste des pokémons n'a pas pu être récupérée. Réssayer dans quelque instants`
                res.status(500).json({message, data: error})
            })
    })
}