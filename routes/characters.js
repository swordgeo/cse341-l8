const express = require('express');
const routes = express.Router();
const security = require('../middleware/authorize.js');
const charactersController = require('../controllers/characters');


routes.get('/', charactersController.getCharacters); 
routes.get('/:id', charactersController.getCharacter);
routes.post('/', security.checkLogin, charactersController.addCharacter);
routes.patch('/:id', security.checkLogin, charactersController.editCharacter);
routes.delete('/:id', security.checkLogin, charactersController.delCharacter);

module.exports = routes; 