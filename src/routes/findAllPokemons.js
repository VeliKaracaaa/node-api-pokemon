const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')

module.exports = (app) => {
    app.get('/api/pokemons', (req, res) => {
        if(req.query.name) {
            const name = req.query.name
            return Pokemon.findAll({
                where : {
                    name: { // est la propriété du model
                        [Op.eq]: name // critère de recherche
                    }
                }
            })
                .then(pokemons => {
                    const message = `Il y a ${pokemons.length} pokémons qui correspondent au terme de recherche ${name}.`
                    res.json({ message, data: pokemons})
                })
        } else {
            Pokemon.findAll()
                .then(pokemon => {
                    const message = 'La liste des pokémons a bien été récupérée.'
                    res.json({ message, data: pokemon })
                })
                .catch(error => {
                    const message =  `La liste des pokémons n'a pas pu être récupérée. Réssayer dans quelque instants`
                    res.status(500).json({message, data: error})
                })
        }
    })
}