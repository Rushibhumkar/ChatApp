import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomAvatar from '../../../components/CustomAvatar';
import CustomText from '../../../components/CustomText';
import {getTextWithLength} from '../../../utils/commonFunction';
import {color} from '../../../const/color';
import {myConsole} from '../../../utils/myConsole';
import {useGetUserById} from '../../../api/user/userFunc';
import {useNavigation} from '@react-navigation/native';
import {chatRoute, homeRoute} from '../../AuthScreens/routeName';

const FollowersCard = ({data}: any) => {
  const navigation = useNavigation();
  const {
    data: userData,
    isLoading: userLoading,
    isError: userErr,
  } = useGetUserById(data?._id);

  if (userLoading) {
    return (
      <View style={styles.userItem}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (userErr) {
    return (
      <View style={styles.userItem}>
        <Text>Error fetching user data</Text>
      </View>
    );
  }
  return (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <CustomAvatar name={data.firstName} style={styles.avatar} />
        <CustomText style={styles.userName}>
          {getTextWithLength(
            `${data.firstName} ${data.middleName} ${data.lastName}`,
            20,
          )}
        </CustomText>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            navigation.navigate(chatRoute.ChatStack, {
              screen: chatRoute.ChattingScreen,
              params: {data: userData?.data},
            })
          }>
          <Image
            source={require('../../../assets/icons/message.png')}
            style={styles.icon}
            tintColor="#000"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FollowersCard;

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
    backgroundColor: color.smoothBg,
    padding: 10,
    borderRadius: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
});
