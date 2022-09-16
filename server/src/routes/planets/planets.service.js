function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.1
    && planet['koi_prad'] < 1.6;
}


module.exports = {
    isHabitablePlanet,
}