import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import MainContainer from '../../components/MainContainer';
import {
  updateFollowRequest,
  useGetPendingFollowRequests,
} from '../../api/follow/followFunc';
import {myConsole} from '../../utils/myConsole';
import CustomAvatar from '../../components/CustomAvatar';
import {color} from '../../const/color';
import CustomButton from '../../components/Buttons/CustomButton';
import {showSuccessToast} from '../../utils/toastModalFunction';
import {useQueryClient} from '@tanstack/react-query';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import FullHeightLoader from '../../components/LoadingCompo/FullHeightLoader';

const PendingRequests = () => {
  const {
    data: pendingReqData,
    isLoading,
    isError,
    refetch,
  } = useGetPendingFollowRequests();

  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>(
    {},
  );
  const queryClient = useQueryClient();

  const handleAcceptReject = async (
    userId: string,
    status: 'accepted' | 'rejected',
  ) => {
    setLoadingStates(prev => ({...prev, [userId]: true}));
    try {
      await updateFollowRequest(userId, status);
      showSuccessToast({description: `The request is ${status}`});
      queryClient.invalidateQueries({queryKey: ['pendingFollowRequests']});
      queryClient.invalidateQueries({queryKey: ['isFollowerIsFollowing']});
    } catch (error) {
      console.error(`Error updating follow request for ${userId}:`, error);
    } finally {
      setLoadingStates(prev => ({...prev, [userId]: false}));
    }
  };
  return (
    <MainContainer title="Pending requests" isBack>
      <View style={styles.container}>
        {isLoading ? (
          <FullHeightLoader />
        ) : isError ? (
          <CustomErrorMessage
            message="Failed to load follow requests."
            onRetry={refetch}
          />
        ) : pendingReqData?.data?.length > 0 ? (
          pendingReqData.data.map((request: any) => (
            <View key={request?._id} style={styles.requestContainer}>
              <CustomAvatar
                name={request?.firstName || 'U'}
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <Text style={styles.username}>
                  {request?.firstName ?? 'N/A'} {request?.lastName ?? 'N/A'}{' '}
                  wants to follow you.
                </Text>
                <Text style={styles.timeAgo}>1d ago</Text>
              </View>
              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Accept"
                  onPress={() => handleAcceptReject(request._id, 'accepted')}
                  customStyling={styles.acceptButton}
                  textStyle={styles.buttonText}
                  loading={loadingStates[request._id]}
                />
                <CustomButton
                  title="Reject"
                  onPress={() => handleAcceptReject(request._id, 'rejected')}
                  customStyling={styles.rejectButton}
                  textStyle={styles.rejectButtonText}
                  loading={loadingStates[request._id]}
                />
              </View>
            </View>
          ))
        ) : (
          <CustomErrorMessage
            message="No pending follow requests."
            onRetry={refetch}
          />
        )}
      </View>
    </MainContainer>
  );
};

export default PendingRequests;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    backgroundColor: '#fff',
    flex: 1,
    padding: 16,
  },
  requestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
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
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rejectButton: {
    borderColor: color.mainColor,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: color.mainColor,
  },
});
