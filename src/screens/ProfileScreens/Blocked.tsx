import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MainContainer from '../../components/MainContainer';
import {myStyle} from '../../sharedStyles';
import NoDataFound from '../../components/NoDataFound';

const Blocked = () => {
  return (
    <MainContainer title="Blocked" isBack>
      <View style={[myStyle.flexCenter, {backgroundColor: '#fff'}]}>
        <NoDataFound
          style={{backgroundColor: '#fff', height: 100}}
          message={'No blocked users found'}
        />
      </View>
    </MainContainer>
  );
};

export default Blocked;

const styles = StyleSheet.create({});
