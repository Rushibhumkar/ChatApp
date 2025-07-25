import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {sizes} from '../../const';
import HeartBeatLoad from './HeartBeatLoad';

interface LoadingCompoProps {
  minHeight?: number;
  loaderSize?: 'large' | 'small';
  backgroundColor?: string;
  style?: ViewStyle;
}

const LoadingCompo: React.FC<LoadingCompoProps> = ({
  minHeight = sizes.width,
  loaderSize = 'large',
  backgroundColor = 'transparent',
  style,
}) => {
  return (
    <View style={[styles.container, {minHeight, backgroundColor}, style]}>
      {/* <ActivityIndicator color={color.mainColor} size={loaderSize} /> */}
      <HeartBeatLoad />
    </View>
  );
};

export default LoadingCompo;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
