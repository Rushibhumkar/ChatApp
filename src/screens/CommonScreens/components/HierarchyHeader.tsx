import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomText from '../../../components/CustomText';
import {color} from '../../../const/color';
import {useNavigation} from '@react-navigation/native';

const HierarchyHeader = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 52,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
        <TouchableOpacity
          style={{borderRadius: '50%', padding: 8}}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/icons/back.png')}
            style={{height: 24, width: 24}}
          />
        </TouchableOpacity>
        <CustomText style={{fontSize: 16, fontWeight: '600'}}>
          Family Hierarchy
        </CustomText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
        {/* <TouchableOpacity
          style={{borderRadius: '50%', padding: 8}}
          onPress={() => null}>
          <Image
            source={require('../../../assets/animatedIcons/search.png')}
            style={{height: 24, width: 24}}
          />
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={{
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: color.mainColor,
          }}
          onPress={() => null}>
          <CustomText style={{color: '#fff', fontWeight: '600'}}>
            Accept
          </CustomText>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default HierarchyHeader;

const styles = StyleSheet.create({});
