import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import MainContainer from '../../components/MainContainer';
import {myConsole} from '../../utils/myConsole';
import {capitalizeFirstLetter} from '../../utils/commonFunction';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import FollowersCard from './components/FollowersCard';
import {color} from '../../const/color';
import OnlyLoader from '../../components/LoadingCompo/OnlyLoader';
import LoadingCompo from '../../components/LoadingCompo/LoadingCompo';
import {sizes} from '../../const';

const FollowersFollowing = ({route, navigation}: any) => {
  const {data, titleName} = route.params;
  return (
    <MainContainer title={capitalizeFirstLetter(titleName)} isBack>
      <View style={styles.container}>
        {!data || data.length === 0 ? (
          <CustomErrorMessage message="No data available" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={item => item._id}
            renderItem={({item}) => <FollowersCard data={item} />}
            ListEmptyComponent={
              // <View style={styles.loaderContainer}>
              //   <ActivityIndicator size="large" color={color.mainColor} />
              //   <Text style={styles.loaderText}>Loading...</Text>
              // </View>
              // <OnlyLoader />
              <LoadingCompo style={{minHeight: sizes.height - 100}} />
            }
          />
        )}
      </View>
    </MainContainer>
  );
};

export default FollowersFollowing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userPhone: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0000ff',
  },
});
