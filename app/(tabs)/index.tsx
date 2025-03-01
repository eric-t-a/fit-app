import { Image, StyleSheet, Platform, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import Map, { MapPolyline, PROVIDER_GOOGLE } from 'react-native-maps';

import useLocation from '@/hooks/useLocation';
import React, { useEffect, useRef } from 'react';
import useRunning from '@/hooks/useRunning';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RunningInfoView from '@/components/RunningInfo';
import { getData } from '@/utils/storage';

export default function HomeScreen() {
  const { currentPosition, errorMsg } = useLocation();
  const mapRef : any = React.createRef();
  const { runningInfo, runningHistory, startRunning, appendCoordinates, stopRunning, runningTime } = useRunning();
  const insets = useSafeAreaInsets();


  useEffect(() => {
    mapRef.current.animateToRegion({
      latitude: currentPosition.latitude + 0.0001,
      longitude: currentPosition.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001
    })
  },[currentPosition.latitude, currentPosition.longitude]);

  useEffect(() => {
    if(runningInfo.isRunning) appendCoordinates(currentPosition);
    
  }, [runningInfo.isRunning, currentPosition])

  function startStopRun(){
    if(runningInfo.isRunning){ 
      stopRunning();
      return;
    }
    startRunning(currentPosition);
  }

  return (
    <View style={{flex: 1}}>
    
      <View style={{...styles.container, paddingTop: insets.top}}>

        <RunningInfoView runningTime={runningTime} distance={runningInfo.distance} calories={runningInfo.calories}/>
        
        <Map 
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          <MapPolyline 
            strokeWidth={4}
            strokeColor="#ff0000"
            coordinates={[...runningInfo.coordinates]}
          />
        </Map>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.6} 
          onPress={() => startStopRun()}
        >
          <Text style={styles.buttonTitle}>
            {runningInfo.isRunning ? "Finish" : "Start"}
          </Text>
        </TouchableOpacity>
      </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: '#000',
  },
  map: {
    height: '100%'
  },
  infoContainer: {
    flex: 1,
    height: '30%',
    backgroundColor: "#000",
    position: "absolute",
    left: 0,
    right: 0,
    borderBottomRightRadius: 17,
    borderBottomLeftRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  infoText: { 
    color: "#fff"
  },
  button: {
    flex: 1,
    height: 56,
    backgroundColor: "#000",
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});
