
const { httpGetAllPlanets } = require('./planets.controller');

const express = require('express');


planetsRouter = express.Router();
planetsRouter.get('/', httpGetAllPlanets);

module.exports = {
    planetsRouter,
}
