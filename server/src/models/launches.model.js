
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query'

async function saveLaunch(launch){
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

//minimize load launch api
async function loadLaunchesData(){
    const firstLaunch = await launchesDatabase.findOne({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    if(!firstLaunch){
       await populateLaunches();
    }
    else{
        console.log('Launches Data already Loaded!');
    }
}

//Loading Launches Data from SpaceXAPI to our DataBase
async function populateLaunches(){
    console.log('Downloading Data!');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name : 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });
    const launchDocs = response.data.docs;
    for (launchDoc of launchDocs){
        const payloads = launchDoc.payloads;
        const customers = payloads.flatMap((payload)=>{
           return payload['customers'];
        });
        const filteredLaunch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };
        console.log(`${filteredLaunch.flightNumber} ${filteredLaunch.mission}`);
        await saveLaunch(filteredLaunch);
    }
}

async function getAllLaunches(limit, skip){
    return await launchesDatabase.find({}, {
        '_id': 0, '__v': 0
    }).sort({
        flightNumber: 1
    }).limit(limit).skip(skip);
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function addNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target
    });
    if(!planet){
        throw new Error('Cannnot able to find the Planet');
    };
    const latestFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ['Vijay', 'NASA'],
        upcoming: true,
        success: true,
    });
    await saveLaunch(newLaunch);
}
async function existLaunchWithId(id){
    const status = await launchesDatabase.findOne({
        flightNumber: id
    });
    return status;
}
async function abortLaunch(id){
    const aborted = await launchesDatabase.updateOne({
        flightNumber: id,
    }, {
        upcoming: false,
        success: false,
    });
    return aborted.modifiedCount;
}
module.exports = {
    loadLaunchesData,
    getAllLaunches,
    addNewLaunch,
    existLaunchWithId,
    abortLaunch,
}