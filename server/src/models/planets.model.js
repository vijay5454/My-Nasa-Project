const fs = require('fs');
const path = require('path');

const {isHabitablePlanet} = require('../routes/planets/planets.service');
const planets = require('./planets.mongo');
const {parse} = require('csv-parse');



function loadHabitablePlanets(){
    return new Promise((resolve, reject)=>{
            fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data1.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', (data)=>{
            if(isHabitablePlanet(data)){
                savePlanet(data);
            }
        })
        .on('error', (error)=>{
            console.log(error);
            reject(error);
        })
        .on('end', async ()=>{
            const countPlanets = (await getAllPlanets()).length;
            console.log(`Habitable Planets loaded successfully-Count = ${countPlanets}`);
            resolve();
        });
    });
}

async function getAllPlanets(){
    return await planets.find({}, {
        '_id': 0, '__v': 0
    });
}

async function savePlanet(planet){
    try{
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    }
    catch(err){
        console.error(`Could not save the planet ${err}`);
    }
}


module.exports = {
    loadHabitablePlanets,
    getAllPlanets,
}
