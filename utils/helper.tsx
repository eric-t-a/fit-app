import { LatLng } from "react-native-maps";

function timeRunning(start_time: Date | null){
    if(!start_time) return '00:00';

    const totalSec = getTimeDiffInSeconds(start_time, new Date());

    const hours = Math.floor(totalSec / 60 / 60);
    const hh = ('0' + hours).slice(-2);

    const minutes = Math.floor((totalSec - 60*60*hours) / 60);
    const mm = ('0' + minutes).slice(-2);

    const seconds = Math.floor((totalSec - 60*60*hours - 60*minutes));
    const ss = ('0' + seconds).slice(-2);

    if(hh != '00') return `${hh}:${mm}:${ss}`;
    return `${mm}:${ss}`;
}
function deg2rad(deg: number) {
    return deg * (Math.PI/180)
}
function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d * 1000; // distance in m
}

function shouldUpdateCoordinates(accuracy: number | null, currentCoord: LatLng, prevCoord: LatLng){
    if(!accuracy) return true;
    if(prevCoord.latitude == 0 && prevCoord.longitude == 0) return true;

    const distance = getDistanceFromLatLonInMeters(prevCoord.latitude, prevCoord.longitude, currentCoord.latitude, currentCoord.longitude);

    if(distance > accuracy) return true;
    return false;
}

function getTimeDiffInSeconds(start_date: Date, final_date: Date) {
    return (final_date.getTime() - start_date.getTime()) / 1000
}

function floatToNDecimal(number: number, n: number){
    return parseFloat(number.toFixed(n));
}
function floatTo1Decimal(number: number){
    return floatToNDecimal(number, 1);
}
function floatTo2Decimal(number: number){
    return floatToNDecimal(number, 2);
}

function getSpeedThroughUSPace(pace: number){
    return 100 * 1.60934 / (pace * 6)
}

function getMets(speed: number){ // m/s
    if(speed > getSpeedThroughUSPace(6)) return 15;
    if(speed > getSpeedThroughUSPace(7)) return 13;
    if(speed > getSpeedThroughUSPace(8)) return 11.5;
    if(speed > getSpeedThroughUSPace(9)) return 10;
    if(speed > getSpeedThroughUSPace(10)) return 9;
    if(speed > getSpeedThroughUSPace(12)) return 7;
    if(speed > getSpeedThroughUSPace(13.5)) return 5.5;
    if(speed > getSpeedThroughUSPace(15)) return 4;
    if(speed > getSpeedThroughUSPace(17)) return 2.8;
    if(speed > getSpeedThroughUSPace(20)) return 2.3;
    if(speed > getSpeedThroughUSPace(30)) return 1.5;
    return 1;
}

function calculateCalories(distance: number, time: number, weight: number){ // meters, seconds and kg
    const speed = distance / time;
    const mets = getMets(speed);

    return mets * weight * time / 60;
}

export { timeRunning, shouldUpdateCoordinates, getDistanceFromLatLonInMeters, floatTo1Decimal, floatTo2Decimal, calculateCalories }