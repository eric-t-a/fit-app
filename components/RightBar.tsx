import React, { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from "react-native"
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props{
    open: boolean;
    children: ReactNode;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const transitionTime = 200;

const RightBar = ({ open, setOpen, children }: Props) => {
    const insets = useSafeAreaInsets();

    const windowWidth = Dimensions.get('window').width;
    const absoluteX = new Animated.Value(open ? 0.2*windowWidth: windowWidth);

    const backgroundOpacity = new Animated.Value(open ? 0.5 : 0);

    const containerRef = useRef<typeof View | null>(null);

    function onOpenPanel(){
        containerRef?.current?.setNativeProps({
            style: { transform: [{ translateX: 0 }] },
        });

        absoluteX.setValue(windowWidth)
        Animated.timing(absoluteX, {
            toValue: 0.2*windowWidth,
            duration: transitionTime,
            useNativeDriver: false,
        }).start();

        backgroundOpacity.setValue(0)
        Animated.timing(backgroundOpacity, {
            toValue: 0.5,
            duration: transitionTime,
            useNativeDriver: false,
        }).start();
    }

    function onClosePanel(absX = 0.2*windowWidth){
        absoluteX.setValue(absX);
        Animated.timing(absoluteX, {
            toValue: windowWidth,
            duration: transitionTime,
            useNativeDriver: false,
        }).start();

        backgroundOpacity.setValue(0.625 * (1 - absX / windowWidth) )
        Animated.timing(backgroundOpacity, {
            toValue: 0,
            duration: transitionTime,
            useNativeDriver: false,
        }).start(({finished}) => {
            containerRef?.current?.setNativeProps({
                style: { transform: [{ translateX: windowWidth }] },
            });
            setOpen(false);
        });
    }
    
    useEffect(() => {
        if(open) onOpenPanel();
    },[open])

    useEffect(() => {
        containerRef?.current?.setNativeProps({
            style: { transform: [{ translateX: windowWidth }] },
        });
    },[])

    function updateOpacity({nativeEvent}) {
        backgroundOpacity.setValue(0.625 * (1 - nativeEvent.absoluteX / windowWidth) )
    }

    const onPanGesture = Animated.event([{
        nativeEvent: { absoluteX: absoluteX }
    }], {
        useNativeDriver: false,
        listener: updateOpacity
    });

    const onPanEnded = ({nativeEvent}) => {
        if(nativeEvent.absoluteX > windowWidth / 2){
            onClosePanel(nativeEvent.absoluteX)
        }
        else{
            Animated.timing(absoluteX, {
                toValue: 0.2*windowWidth,
                duration: transitionTime,
                useNativeDriver: false,
            }).start();
            Animated.timing(backgroundOpacity, {
                toValue: 0.5,
                duration: transitionTime,
                useNativeDriver: false,
            }).start();
        }
    }



    return(
        
            <View
                style={{
                    ...styles.outerContainer, 
                    marginTop: insets.top, 
                }}
                ref={containerRef}
            >
                <TouchableOpacity 
                    onPress={() => onClosePanel()} 
                    style={{
                        ...styles.leftSide, 
                        marginTop: insets.top
                    }}
                    activeOpacity={0.9}
                >
                    <Animated.View style={{...styles.animatedLeftSideBg, opacity: backgroundOpacity}}/>
                </TouchableOpacity>
                <PanGestureHandler onGestureEvent={onPanGesture} onEnded={onPanEnded}>
                    <Animated.View 
                        style={{
                            ...styles.innerContainer, 
                            marginTop: insets.top,
                            left: absoluteX,
                            paddingRight: windowWidth*0.2 + 24
                        }}
                    >
                        {children}
                    </Animated.View>
                </PanGestureHandler>
            </View>
        
    );

}

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 2,
        right: 0,
        top: 0,
    },
    leftSide: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        right: 0,
        top: -24,
    },
    animatedLeftSideBg: {
        backgroundColor: 'black', 
        height: '100%'
    },
    innerContainer: {
        backgroundColor: 'black',
        position: 'relative',
        height: '100%',
        width: '100%',
        right: 0,
        top: -24,
        padding: 24,
    }
});
export default RightBar;