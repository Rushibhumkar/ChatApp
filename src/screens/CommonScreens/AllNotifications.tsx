import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainContainer from '../../components/MainContainer';
import {
  updateFollowRequest,
  useGetFollowData,
  useGetPendingFollowRequests,
} from '../../api/follow/followFunc';
import {myConsole} from '../../utils/myConsole';
import CustomText from '../../components/CustomText';
import {color} from '../../const/color';
import CustomButton from '../../components/Buttons/CustomButton';
import CustomAvatar from '../../components/CustomAvatar';
import {useQueryClient} from '@tanstack/react-query';
import {showSuccessToast} from '../../utils/toastModalFunction';
import {useIsFocused} from '@react-navigation/native';
import {useGetAllUsers} from '../../api/user/userFunc';
import {commonRoute, homeRoute, profileRoute} from '../AuthScreens/routeName';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import {sizes} from '../../const';
import LoadingCompo from '../../components/LoadingCompo/LoadingCompo';

const AllNotifications = ({navigation}: any) => {
  const {
    data: pendingReqData,
    isLoading: pendingReqLoading,
    isError: pendingReqError,
    refetch: pendingFollowReqRefetch,
  } = useGetPendingFollowRequests();

  const [searchValue, setSearchValue] = useState('');
  const {
    data: allUsersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: allUsersLoading,
    isError: allUsersError,
    refetch: allUsersRefetch,
  } = useGetAllUsers(searchValue, 0);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>(
    {},
  );

  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);

  const handleAcceptReject = async (
    userId: string,
    status: 'accepted' | 'rejected',
  ) => {
    setLoadingStates(prev => ({...prev, [userId]: true}));
    try {
      await updateFollowRequest(userId, status);
      // await followDataRefetch();
      queryClient.invalidateQueries({queryKey: ['pendingFollowRequests']});
      queryClient.invalidateQueries({queryKey: ['isFollowerIsFollowing']});
      showSuccessToast({description: `The request is ${status}`});
    } catch (error) {
      console.error(`Error updating follow request for ${userId}:`, error);
    } finally {
      setLoadingStates(prev => ({...prev, [userId]: false}));
    }
  };

  // const handleSendFollowRequest = async () => {
  //   setFollowReqLoading(true);
  //   try {
  //     await sendFollowRequest('67bad2233dc936e19caf2cb6');
  //     // queryClient.invalidateQueries({queryKey:['followData']});
  //     queryClient.invalidateQueries({queryKey: ['pendingFollowRequests']});
  //     showSuccessToast({description: 'Follow request sent successfully'});
  //   } catch (error) {
  //     console.error('Error sending follow request:', error);
  //   } finally {
  //     setFollowReqLoading(false);
  //   }
  // };
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setRefreshing(true);
      (async () => {
        try {
          // await Promise.all([pendingFollowReqRefetch(), followDataRefetch()]);
          await Promise.all([pendingFollowReqRefetch()]);
        } catch (error) {
          console.error('Error refreshing follow requests:', error);
        } finally {
          setRefreshing(false);
        }
      })();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // await Promise.all([pendingFollowReqRefetch(), followDataRefetch()]);
      await Promise.all([pendingFollowReqRefetch()]);
    } catch (error) {
      console.error('Error refreshing follow requests:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true; // Prevent default back button behavior
      },
    );

    return () => {
      backHandler.remove(); // Properly remove the event listener
    };
  }, []);

  const users = allUsersData
    ? allUsersData.pages.flatMap((page: any) => page.data.users)
    : [];

  return (
    <MainContainer title="Notifications" isBack>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingBottom: 20,
          backgroundColor: '#fff',
          flex: 1,
          padding: 16,
        }}>
        <View>
          <CustomText
            style={{fontSize: 14, fontWeight: 'bold', color: color.titleColor}}>
            Recents
          </CustomText>
          {pendingReqLoading ? (
            <ActivityIndicator size="large" color={color.mainColor} />
          ) : pendingReqError ? (
            <Text style={styles.errorText}>Error loading follow requests.</Text>
          ) : pendingReqData?.data?.length > 0 ? (
            pendingReqData.data.map((request: any) => (
              <View key={request?._id} style={styles.requestContainer}>
                <CustomAvatar
                  name={request?.firstName || 'A'}
                  style={{marginRight: 8}}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.username}>
                    {request?.firstName ?? 'N/A'} {request?.lastName ?? 'N/A'}{' '}
                    wants to follow you.
                  </Text>
                  <Text style={styles.timeAgo}>1d ago</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <>
                    <CustomButton
                      title="Accept"
                      onPress={() =>
                        handleAcceptReject(request._id, 'accepted')
                      }
                      customStyling={styles.acceptButton}
                      textStyle={styles.buttonText}
                      // loading={loadingStates[request.follower._id]}
                    />
                    <CustomButton
                      title="Reject"
                      onPress={() =>
                        handleAcceptReject(request._id, 'rejected')
                      }
                      customStyling={styles.rejectBtn}
                      textStyle={styles.rejectBtnText}
                      // loading={loadingStates[request.follower._id]}
                    />
                  </>
                </View>
              </View>
            ))
          ) : (
            <CustomText style={styles.noRequestsText}>
              No pending follow requests.
            </CustomText>
          )}
        </View>
        <View style={{marginTop: 12}}>
          <CustomText style={styles.suggTxt}>Suggestions</CustomText>
          {allUsersLoading ? (
            <LoadingCompo minHeight={sizes.height / 1.1} />
          ) : allUsersError ? (
            <CustomErrorMessage
              message="Something went wrong"
              onRetry={allUsersRefetch}
              height={sizes.height / 1.5}
            />
          ) : users?.length > 0 ? (
            users?.map((item: any, index: number) => {
              return (
                <TouchableOpacity
                  style={{
                    borderBottomWidth: 0.8,
                    borderBottomColor: 'grey',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                  activeOpacity={0.6}
                  key={index}
                  onPress={() =>
                    navigation.navigate(commonRoute.CommonStack, {
                      screen: homeRoute.UsersProfileDetails,
                      params: {
                        data: item,
                        showBasicDetails: true,
                        request: true,
                      },
                    })
                  }>
                  <CustomAvatar
                    imgUrl={item?.profileImageUrl}
                    name={item?.item.firstName ?? ''}
                  />
                  <CustomText>
                    {`${item.firstName ?? ''} ${item.middleName ?? ''} ${
                      item.lastName ?? ''
                    }`}
                  </CustomText>
                </TouchableOpacity>
              );
            })
          ) : (
            <CustomText style={styles.noRequestsText}>
              No users available
            </CustomText>
          )}
        </View>
      </ScrollView>
    </MainContainer>
  );
};

export default AllNotifications;

const styles = StyleSheet.create({
  requestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: color.mainColor,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  rejectBtn: {
    borderColor: color.mainColor,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  followingButton: {
    borderColor: color.mainColor,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rejectBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: color.mainColor,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 10,
  },
  noRequestsText: {
    textAlign: 'center',
    // marginTop: 20,
    color: '#888',
    marginVertical: 20,
  },
  suggTxt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color.titleColor,
    marginBottom: 8,
  },
});
