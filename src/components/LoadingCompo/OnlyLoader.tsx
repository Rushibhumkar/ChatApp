import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {color} from '../../const/color';

const OnlyLoader = () => {
  return <ActivityIndicator size={'small'} color={color.mainColor} />;
};

export default OnlyLoader;

const styles = StyleSheet.create({});
