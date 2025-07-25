import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const AnimatedLoader = () => {
  const bounce = useRef(new Animated.Value(30)).current;

  const step1Top = useRef(new Animated.Value(0)).current;
  const step2Top = useRef(new Animated.Value(50)).current;
  const step3Top = useRef(new Animated.Value(95)).current;

  const step1Left = 75;
  const step2Left = 40;
  const step3Left = 5;

  useEffect(() => {
    // Ball bounce loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 140,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(bounce, {
          toValue: 30,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
    ).start();

    const animateSteps = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(step1Top, {
            toValue: 50,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(step2Top, {
            toValue: 95,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(step3Top, {
            toValue: 140,
            duration: 200,
            useNativeDriver: false,
          }),
        ]),
        Animated.delay(100),
        Animated.parallel([
          Animated.timing(step1Top, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.timing(step2Top, {
            toValue: 50,
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.timing(step3Top, {
            toValue: 95,
            duration: 0,
            useNativeDriver: false,
          }),
        ]),
        Animated.delay(300),
      ]).start(() => {
        animateSteps(); // loop
      });
    };

    animateSteps();
  }, []);

  return (
    <View style={styles.loader}>
      <Animated.View style={[styles.ball, {bottom: bounce}]} />
      <Animated.View style={[styles.step, {left: step1Left, top: step1Top}]} />
      <Animated.View style={[styles.step, {left: step2Left, top: step2Top}]} />
      <Animated.View style={[styles.step, {left: step3Left, top: step3Top}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    position: 'relative',
    width: 120,
    height: 160,
    alignSelf: 'center',
    marginTop: 60,
  },
  ball: {
    position: 'absolute',
    left: 50,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2a9d8f',
  },
  step: {
    position: 'absolute',
    width: 45,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#f2f2f2',
  },
});

export default AnimatedLoader;
