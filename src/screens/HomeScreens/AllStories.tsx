import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import MainContainer from '../../components/MainContainer';
import {useGetMyData} from '../../api/profile/profileFunc';
import {useGetAllStories, useGetUserStories} from '../../api/story/storyFunc';
import {color} from '../../const/color';
import CustomText from '../../components/CustomText';
import {fileViewURL} from '../../api/axiosInstance';
import CustomAvatar from '../../components/CustomAvatar';
import {homeRoute} from '../AuthScreens/routeName';
import {shadow} from '../../sharedStyles';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import {sizes} from '../../const';
import {useNotifications} from '../../api/notification/notificationFunc';
import LoadingCompo from '../../components/LoadingCompo/LoadingCompo';
import {RefreshControl} from 'react-native';
import SwitchName from '../../components/LoadingCompo/SwitchName';
import {myConsole} from '../../utils/myConsole';
import {dummyPosts} from '../../const/data';
import PostCard from '../PostStack/components/PostCard';

const AllStories = ({navigation}: any) => {
  const {
    data: myData,
    isLoading: myDataLoad,
    isError: myDataErr,
  } = useGetMyData();
  const senderId = myData?.data?._id;
  const {
    data: allStories,
    isLoading: allStoriesLoad,
    isError: allStoriesErr,
    refetch,
  } = useGetAllStories();
  const {
    data: storyById,
    isLoading: myStoryLoad,
    isError: myStoryErr,
  } = useGetUserStories(senderId);
  const {
    data: pushNotis,
    isLoading: pushNotiLoad,
    isError: pushNotiErr,
  } = useNotifications();
  // myConsole('storyById', storyById);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredStories = allStories?.data?.filter(
    storyGroup => storyGroup.user._id !== senderId,
  );

  return (
    <MainContainer
      title="Stories"
      // showFilterBtn={recentChats?.data?.chats?.length > 0}
      removeFlexProp={true}
      bgColor={'#fff'}
      showRightIcon={[
        // {
        //   imageSource: require('../../assets/animatedIcons/search.png'),
        //   onPress: () => navigation.navigate(homeRoute.StoriesSearchScreen, {
        //   data: allStories,
        // }),,
        //   size: 26,
        // },
        {
          imageSource: require('../../assets/animatedIcons/friend_request.png'),
          onPress: () => navigation.navigate(homeRoute.PendingRequests),
          size: 26,
        },
        {
          imageSource: require('../../assets/animatedIcons/add_friend.png'),
          onPress: () => navigation.navigate(homeRoute.AddUsers),
          size: 26,
        },
        {
          imageSource: require('../../assets/animatedIcons/notification-bell.png'),
          onPress: () => navigation.navigate(homeRoute.HomeNotifications),
          size: 26,
        },
      ]}>
      {(allStoriesLoad || myStoryLoad) && (
        <LoadingCompo minHeight={sizes.height / 1.1} />
      )}
      {allStoriesErr && (
        <CustomErrorMessage message="Something went wrong" onRetry={refetch} />
      )}
      {/* <SwitchName /> */}
      {(myData || allStories?.data?.length > 0) && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 120}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.statusContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statusContent}>
              {myData && (
                <View style={styles.statusItem}>
                  <View style={{position: 'relative', marginTop: 4}}>
                    <CustomAvatar
                      onPress={() =>
                        navigation.navigate(homeRoute.ViewStory, {
                          data: storyById?.data,
                        })
                      }
                      name={`${myData.data.firstName} ${myData.data.lastName}`}
                      imgUrl={myData.data.profileImageUrl}
                      imgStyle={{
                        height: 70,
                        width: 70,
                        borderWidth: 3,
                        borderColor: color.mainColor,
                      }}
                      style={[
                        styles.avatarLarge,
                        {
                          borderWidth: 3,
                          borderColor: color.mainColor,
                          padding: 4,
                        },
                      ]}
                    />
                    <TouchableOpacity
                      style={styles.addIconCont}
                      activeOpacity={0.6}
                      onPress={() => navigation.navigate(homeRoute.AddStory)}>
                      <Image
                        source={require('../../assets/icons/add.png')}
                        style={{height: 22, width: 22}}
                        tintColor={color.titleColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <CustomText style={styles.statusText}>
                    {myData.data.firstName.length > 12
                      ? `${myData.data.firstName.slice(0, 12)}...`
                      : myData.data.firstName}
                  </CustomText>
                </View>
              )}

              {/* Other Users’ Stories */}
              {allStories?.data?.length > 0 &&
                filteredStories.map((storyGroup: any) => {
                  const user = storyGroup.user;
                  return (
                    <View key={user._id} style={styles.statusItem}>
                      <TouchableOpacity
                        style={styles.storySelectBtn}
                        onPress={() =>
                          navigation.navigate(homeRoute.ViewStory, {
                            data: storyGroup.stories,
                            user: allStories?.data[0]?.user,
                          })
                        }>
                        <Image
                          source={{
                            uri: `${fileViewURL}${storyGroup.stories[0].mediaKey}`,
                          }}
                          style={{height: 60, width: 60, borderRadius: 30}}
                          blurRadius={2}
                        />
                      </TouchableOpacity>
                      <CustomText style={styles.statusText}>
                        {user.firstName.length > 12
                          ? `${user.firstName.slice(0, 12)}...`
                          : user.firstName}
                      </CustomText>
                    </View>
                  );
                })}
            </ScrollView>
          </View>

          {/* Other Stories */}
          {/* {allStories?.data?.length > 0 &&
            filteredStories.map((storyGroup: any) => {
              const user = storyGroup.user;
              return (
                <View key={user._id} style={styles.statusItem}>
                  <TouchableOpacity
                    style={styles.storySelectBtn}
                    onPress={() =>
                      navigation.navigate(homeRoute.ViewStory, {
                        data: storyGroup.stories,
                        user: allStories?.data[0]?.user,
                      })
                    }>
                    <Image
                      source={{
                        uri: `${fileViewURL}${storyGroup.stories[0].mediaKey}`,
                      }}
                      style={{height: 60, width: 60, borderRadius: 30}}
                      blurRadius={2}
                    />
                  </TouchableOpacity>
                  <CustomText style={styles.statusText}>
                    {user.firstName.length > 12
                      ? `${user.firstName.slice(0, 12)}...`
                      : user.firstName}
                  </CustomText>
                </View>
              );
            })} */}

          <View style={{marginTop: 10}}>
            {dummyPosts.map((item, index) => (
              <PostCard key={index} post={item} />
            ))}
          </View>
          {/* {allStories?.data?.length === 0 && (
        <View style={styles.noStoriesView}>
          <CustomText style={{fontSize: 32}}>🙄</CustomText>
          <CustomText style={styles.noDataText}>
            No stories available
          </CustomText>
        </View>
      )} */}
        </ScrollView>
      )}
    </MainContainer>
  );
};

export default AllStories;

const styles = StyleSheet.create({
  statusContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    // height: 100,
    backgroundColor: '#fff',
    // borderBottomWidth: 0.8,
    // borderBottomColor: color.placeholderColor,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 80,
    marginRight: 16,
    // backgroundColor: 'red',
  },

  statusText: {
    fontSize: 12,
    marginTop: 8,
    color: '#333',
    textAlign: 'center',
    width: '100%',
  },

  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  addIconCont: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 5,
    padding: 2,
    ...shadow,
  },

  noDataText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginTop: 8,
  },
  noStoriesView: {
    height: sizes.height / 1.4,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  storySelectBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: color.mainColor,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
