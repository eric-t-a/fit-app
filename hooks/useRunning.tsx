import { timeRunning } from "@/utils/helper";
import { storeData } from "@/utils/storage";
import { useEffect, useState } from "react";
import { LatLng } from "react-native-maps";

interface RunningInfo {
    isRunning: boolean;
    start_time: null | Date;
    end_time: null | Date;
    calories: number;
    coordinates: LatLng[];
}

var timerInterval: any = null;

const runningEmptyState = { isRunning: false, start_time: null, end_time: null, calories: 0, coordinates: [] } ;

const useRunning = () => {
    const [runningInfo, setActiveRunningState] = useState<RunningInfo>(runningEmptyState);
    const [runningHistory, setHistoryState] = useState<RunningInfo[]>([]);
    const [runningTime, setRunningTime] = useState('00:00');

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
            coordinates: [coord]
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
        setRunningInfo({
            ...runningInfo, 
            isRunning: true, 
            start_time: new Date(), 
            coordinates: [...runningInfo.coordinates, coord]
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