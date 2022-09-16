

const { planetsRouter } = require('./routes/planets/planets.routes');
const { launchesRouter } = require('./routes/launches/launches.routes');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(morgan('tiny'));
app.use(express.json());
app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

module.exports = app;