function checkLaunch(launch){
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return 'Property Missing';
    }
    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(launch.launchDate)){
        return 'Invalid Launch Date';
    }
}

module.exports = {
    checkLaunch,
}