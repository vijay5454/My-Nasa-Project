
const {getAllLaunches, addNewLaunch, existLaunchWithId, abortLaunch} = require('../../models/launches.model');
const { checkLaunch } = require('./launches.service');
const {getPagination} = require('../../services/query');

async function httpGetAllLaunches(req, res){
    const {limit, skip} = getPagination(req.query);
    const launches = await getAllLaunches(limit, skip)
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res){
    launch = req.body;
    addLaunchStatus = checkLaunch(launch);
    if(addLaunchStatus === 'Property Missing'){
        return res.status(400).json({
            error: 'Missing Property Please Check'
        })
    }
    if(addLaunchStatus === 'Invalid Launch Date'){
        return res.status(400).json({
            error: 'Invalid Launch Date Please Check'
        })
    }
    await addNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpDeleteLaunch(req, res){
    const launchId = Number(req.params.id);
    const launchStatus = await existLaunchWithId(launchId);
    if(!launchStatus){
        return res.status(400).json({
            error: 'Launch is not deleted due to invalid Launch Id'
        });
    }
    const aborted = await abortLaunch(launchId);
    if(!aborted){
        return res.status(400).json({
            error: 'Launch Does not deleted due to internal Error'
        })
    }
    return res.status(200).json({
        ok: true,
    });
}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeleteLaunch,
}