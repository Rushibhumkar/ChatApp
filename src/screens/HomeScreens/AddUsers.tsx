import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import CustomText from '../../components/CustomText';
import MainContainer from '../../components/MainContainer';
import CustomAvatar from '../../components/CustomAvatar';
import {homeRoute} from '../AuthScreens/routeName';
import {useNavigation} from '@react-navigation/native';
import {color} from '../../const/color';
import {useGetAllUsers} from '../../api/user/userFunc';

type UserType = {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
};

const AddUsers = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigation = useNavigation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useGetAllUsers(searchValue, 10);

  const users: UserType[] =
    data?.pages.flatMap(page => page?.data?.users ?? []) ?? [];

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchValue]);
  const renderItem = ({item}: {item: UserType}) => (
    <TouchableOpacity
      style={styles.userItem}
      activeOpacity={0.6}
      onPress={() =>
        navigation.navigate(
          homeRoute.HomeStack as never,
          {
            screen: homeRoute.UsersProfileDetails,
            params: {
              data: item,
              showBasicDetails: true,
              request: true,
            },
          } as never,
        )
      }>
      <CustomAvatar name={item?.firstName ?? ''} />
      <CustomText>
        {`${item?.firstName ?? ''} ${item?.middleName ?? ''} ${
          item?.lastName ?? ''
        }`.trim()}
      </CustomText>
    </TouchableOpacity>
  );

  return (
    <MainContainer
      title="Suggestions"
      isBack
      searchProps={{
        showSearchBar: true,
        onSearch: (text: string) => setSearchValue(text),
      }}>
      {/* <TextInput
        placeholder="Search users..."
        value={searchValue}
        onChangeText={setSearchValue}
        style={styles.searchInput}
      /> */}

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={color.mainColor}
          style={{marginTop: 20}}
        />
      ) : isError ? (
        <CustomText style={styles.errorText}>
          Failed to load users. Please try again.
        </CustomText>
      ) : (
        <FlatList
          data={users}
          style={{backgroundColor: '#fff'}}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => {
            if (isFetchingNextPage) {
              return (
                <ActivityIndicator
                  size="small"
                  color={color.mainColor}
                  style={{marginVertical: 10}}
                />
              );
            }
            if (!hasNextPage) {
              return (
                <CustomText
                  style={{
                    textAlign: 'center',
                    color: '#aaa',
                    marginVertical: 10,
                  }}>
                  No more users
                </CustomText>
              );
            }
            return null;
          }}
          ListEmptyComponent={
            <CustomText style={styles.noDataText}>
              No users available
            </CustomText>
          }
        />
      )}
    </MainContainer>
  );
};

export default AddUsers;

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    gap: 12,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
});
