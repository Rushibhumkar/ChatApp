import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import CustomSearch from '../../components/CustomSearch';
import {myConsole} from '../../utils/myConsole';
import LoadingCompo from '../../components/LoadingCompo/LoadingCompo';
import {useNavigation} from '@react-navigation/native';
import {chatRoute, homeRoute} from '../AuthScreens/routeName';
import {useGetAllUsers} from '../../api/user/userFunc';
import {capitalizeFirstLetter} from '../../utils/commonFunction';

const StoriesSearchScreen = ({navigation}: any) => {
  const [searchValue, setSearchValue] = useState('');

  // Fetch users with infinite scroll
  const {
    data: allUsersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: allUsersLoading,
    isError: allUsersError,
    error,
  } = useGetAllUsers(searchValue, 10);

  // Handle empty data or error
  const renderEmptyState = () => {
    if (allUsersLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loaderText}>Loading users...</Text>
        </View>
      );
    }

    if (allUsersError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to fetch data. Please try again later.
          </Text>
        </View>
      );
    }

    if (allUsersData?.pages?.[0]?.users?.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No users found.</Text>
        </View>
      );
    }

    return null;
  };

  // Render user items
  const renderUserItem = ({item}: any) => {
    // Make sure the item has the properties you need
    const {firstName, middleName, lastName} = item;
    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() =>
          navigation.navigate(chatRoute.ChattingScreen, {data: item})
        }>
        <Text
          style={
            styles.userName
          }>{`${firstName} ${middleName} ${lastName}`}</Text>
      </TouchableOpacity>
    );
  };

  // Load more users when reaching the bottom
  const loadMoreUsers = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  return (
    <View style={styles.container}>
      <CustomSearch onSearch={setSearchValue} placeholder="Search ..." isBack />
      {renderEmptyState()}

      <FlatList
        data={allUsersData?.pages?.[0]?.data?.users || []}
        keyExtractor={item => item._id}
        renderItem={renderUserItem}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.5}
        // ListFooterComponent={
        //   isFetchingNextPage ? (
        //     <ActivityIndicator size="large" color="#000" />
        //   ) : null
        // }
      />
    </View>
  );
};

export default StoriesSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 0.8,
    borderBottomColor: 'grey',
  },
  userName: {
    fontSize: 16,
    fontWeight: '400',
  },
});
