import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { shouldUpdateCoordinates } from "@/utils/helper";

const LOCATION_TASK_NAME = 'background-location-task';

const isDev = true;

const useLocation = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [currentPosition, setCurrentPosition] = useState({latitude: 0, longitude: 0});
    var curPos = {latitude: 0, longitude: 0};

    const getUserLocation = async () => {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if(foregroundStatus !== 'granted') return;
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if(backgroundStatus !== 'granted') return;
        if(isDev){
            Location.watchPositionAsync({accuracy: Location.Accuracy.BestForNavigation}, ({ coords }) => {
                const { accuracy, latitude, longitude } = coords;
                if(shouldUpdateCoordinates(accuracy, {latitude, longitude}, curPos)){
                    setCurrentPosition({latitude, longitude});
                    curPos = {latitude, longitude};
                }
            });
        }
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.BestForNavigation,
        });
    };

    useEffect(() => {
        getUserLocation();
    },[]);

    return { currentPosition, errorMsg};
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      return;
    }
    if (data) {
      const { locations } = data;
      console.log(locations)
    }
});

export default useLocation;