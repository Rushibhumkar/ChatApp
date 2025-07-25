import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MainContainer from '../../components/MainContainer';

const ProfPostsDetails = ({route}: any) => {
  const {item} = route.params;
  return (
    <MainContainer
      title={typeof item === 'string' ? item : 'Post details'}
      isBack></MainContainer>
  );
};

export default ProfPostsDetails;
