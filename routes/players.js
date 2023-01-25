const express = require('express');
const routes = express.Router();
const security = require('../middleware/authorize.js');
const playersController = require('../controllers/players');

routes.get('/', playersController.getPlayers);
routes.get('/:id', playersController.getPlayer);
routes.post('/', security.checkLogin, playersController.addPlayer);
routes.patch('/:id', security.checkLogin, playersController.editPlayer);
routes.delete('/:id', security.checkLogin, playersController.delPlayer);

module.exports = routes;

