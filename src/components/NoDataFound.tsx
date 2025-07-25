import {Image, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {sizes} from '../const';
import CustomText from './CustomText';

interface NoDataFoundProps {
  style?: ViewStyle;
  message?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({style, message}) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../assets/icons/noDataFound.png')}
        style={styles.image}
      />
      <CustomText style={styles.text}>{message || 'No data found'}</CustomText>
    </View>
  );
};

export default NoDataFound;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: sizes.height,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    height: 80,
    width: 80,
  },
  text: {
    fontSize: 16,
  },
});
