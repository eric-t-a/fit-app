import useRunning, { RunningInfo } from "@/hooks/useRunning";
import { floatTo2Decimal, getPace, timeRunning } from "@/utils/helper";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RunningInfoProps{
    runningTime: string;
    distance: number;
    calories: number;
    start_time: null | Date;
    pace: string;
}

const RunningInfoView = ({ runningTime, distance, calories, start_time, pace }: RunningInfoProps) => {
    const insets = useSafeAreaInsets();

    return(
        <View style={{...styles.infoContainer, top: insets.top}}>
          <View style={{paddingTop: 1, marginBottom: 24}}>
            <Text style={{...styles.infoText, ...styles.timeText}}>
              {runningTime}
            </Text>
          </View>
          <View style={styles.infoStats}>
            <View style={styles.infoBlock}>
                <Text style={{...styles.infoTextValue, ...styles.infoText}}>
                    {floatTo2Decimal(distance / 1000)}
                </Text>
                <Text style={styles.infoText}>
                    km
                </Text>
            </View>
            <View style={styles.infoBlock}>
                <Text style={{...styles.infoTextValue, ...styles.infoText}}>
                    {calories}
                </Text>
                <Text style={styles.infoText}>
                    kcal
                </Text>
            </View>
            <View style={styles.infoBlock}>
                <Text style={{...styles.infoTextValue, ...styles.infoText}}>
                    {start_time ? pace : '00:00'}
                </Text>
                <Text style={styles.infoText}>
                    min/km
                </Text>
            </View>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoContainer: {
        flex: 1,
        padding: 24,
        height: '30%',
        maxHeight: 190,
        backgroundColor: "#000",
        position: "absolute",
        left: 0,
        right: 0,
        borderBottomRightRadius: 17,
        borderBottomLeftRadius: 17,
        alignItems: "center",
        zIndex: 1,
        flexWrap: 'wrap',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    infoBlock: {
        flex: 1,
    },
    infoStats: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoText: { 
      color: "#fff",
      textAlign: "center"
    },
    infoTextValue: { 
        fontSize: 24,
      },
    timeText: {
        fontSize: 48,
        flexBasis: null
    }
  });

  export default RunningInfoView;