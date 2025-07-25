import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Polyline} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const HeartBeatLoad = () => {
  const dashOffset = useSharedValue(192);

  // Animate dash offset
  useEffect(() => {
    dashOffset.value = withRepeat(withTiming(0, {duration: 1400}), -1, false);
  }, [dashOffset]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  return (
    <View style={styles.container}>
      <Svg width={64} height={48}>
        {/* Static background line */}
        <Polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          stroke="#ff4d5033"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Animated front line */}
        <AnimatedPolyline
          animatedProps={animatedProps}
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          stroke="#ff4d4f"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="48,144"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default HeartBeatLoad;
