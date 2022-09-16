
const {httpGetAllLaunches, httpAddNewLaunch, httpDeleteLaunch} = require('./launches.controller');

const express = require('express');

launchesRouter = express.Router();
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpDeleteLaunch);

module.exports = {
    launchesRouter,
}