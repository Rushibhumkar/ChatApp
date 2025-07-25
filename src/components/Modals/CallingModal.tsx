import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomModal from '../CustomModal';
import CustomText from '../CustomText';

const CallingModal = () => {
  return (
    <CustomModal visible={false} onClose={() => null}>
      <CustomText>ro</CustomText>
    </CustomModal>
  );
};

export default CallingModal;

const styles = StyleSheet.create({});
