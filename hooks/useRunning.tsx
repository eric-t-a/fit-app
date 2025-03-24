import { calculateCalories, floatTo1Decimal, getDistanceFromLatLonInMeters, timeRunning } from "@/utils/helper";
import { getData, storeData } from "@/utils/storage";
import { useEffect, useState } from "react";
import { LatLng } from "react-native-maps";

interface Coordinates extends LatLng {
    time: Date;
}
export interface RunningInfo {
    isRunning: boolean;
    start_time: null | Date;
    end_time: null | Date;
    calories: number;
    coordinates: Coordinates[];
    distance: number; // meters
}

var timerInterval: any = null;

const runningEmptyState = { isRunning: false, start_time: null, end_time: null, calories: 0, coordinates: [], distance: 0 } ;

const useRunning = () => {
    const [runningInfo, setActiveRunningState] = useState<RunningInfo>(runningEmptyState);
    const [runningHistory, setHistoryState] = useState<RunningInfo[]>([]);
    const [runningTime, setRunningTime] = useState('00:00');

    async function setupHistory(){
        const history = await getData('runningHistory');
        setHistoryState(history ?? []);
    }

    useEffect(() => {
        setupHistory();
    },[])

    function setRunningInfo(info: RunningInfo){
        setActiveRunningState({...info});
        storeData('runningInfo', {...info});
    }
    function setHistoryRunningInfo(history: RunningInfo[]){
        setHistoryState([...history]);
        storeData('runningHistory', [...history]);
    }
    function appendInfoToHistory(info: RunningInfo){
        setHistoryRunningInfo([...runningHistory, info]);
    }

    function startRunning(coord: LatLng) {
        setRunningInfo({
            ...runningInfo, 
            isRunning: true, 
            start_time: new Date(), 
            coordinates: [{...coord, time: new Date()}]
        });
    }

    function stopRunning(){
        setRunningTime(timeRunning(null));
        appendInfoToHistory({
            ...runningInfo,
            end_time: new Date()
        });
        setRunningInfo({...runningEmptyState})
    }

    function appendCoordinates(coord: LatLng){
        let deltaDistance = 0;
        let deltaCalories = 0;
        const timeNow = new Date();
        if(runningInfo.coordinates.length){
            const lastCoord = runningInfo.coordinates[runningInfo.coordinates.length - 1];
            const deltaTime = Math.floor((timeNow.getTime() - lastCoord.time.getTime()) / 1000); // seconds

            deltaDistance = getDistanceFromLatLonInMeters(lastCoord.latitude, lastCoord.longitude, coord.latitude, coord.longitude);
            deltaDistance = floatTo1Decimal(deltaDistance)

            deltaCalories = calculateCalories(deltaDistance, deltaTime, 70);
        }
        setRunningInfo({
            ...runningInfo, 
            calories: runningInfo.calories + Math.floor(deltaCalories),
            distance: runningInfo.distance + deltaDistance,
            isRunning: true, 
            coordinates: [...runningInfo.coordinates, {...coord, time: new Date()}]
        });
    }

    useEffect(() => {
        if(runningInfo.isRunning){
            timerInterval = setInterval(() => setRunningTime(timeRunning(runningInfo.start_time)), 1000);
            return;
        }

        clearInterval(timerInterval);
    }, [runningInfo.isRunning])

    return { runningInfo, runningHistory, startRunning, appendCoordinates, stopRunning, runningTime };

}

export default useRunning;