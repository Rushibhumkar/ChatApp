import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import MainContainer from '../../components/MainContainer';
import {useNotifications} from '../../api/notification/notificationFunc';
import {myConsole} from '../../utils/myConsole';
import moment from 'moment';
import CustomText from '../../components/CustomText';
import {color} from '../../const/color';

const NotificationItem = ({item}: any) => {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.notificationCard}>
      <Image
        source={require('../../assets/animatedIcons/notification-bell.png')}
        style={styles.icon}
      />
      <View style={styles.textWrapper}>
        <CustomText style={styles.title}>{item.title}</CustomText>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeNotifications = () => {
  const {data, isLoading, isError, refetch, isFetching} = useNotifications();
  const notifications = data?.data?.notifications ?? [];
  const isEmpty = notifications.length === 0;

  return (
    <MainContainer title="Notifications" isBack>
      <View style={styles.container}>
        {isLoading && !isFetching ? (
          <ActivityIndicator size="large" color={color.mainColor} />
        ) : isError ? (
          <Text style={styles.errorText}>
            Failed to load notifications. Please try again.
          </Text>
        ) : isEmpty ? (
          <Text style={styles.emptyText}>No notifications available</Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={item => item._id}
            renderItem={({item}) => <NotificationItem item={item} />}
            contentContainerStyle={{paddingBottom: 20}}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={refetch}
                colors={[color.mainColor]}
                tintColor={color.mainColor}
              />
            }
          />
        )}
      </View>
    </MainContainer>
  );
};

export default HomeNotifications;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
    marginTop: 30,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 30,
  },
});
