import {API_AXIOS} from '../axiosInstance';
import {useQuery} from '@tanstack/react-query';

export const getFollowData = async (
  userId: string,
  searchValue: string = '',
) => {
  try {
    const {data} = await API_AXIOS.get(`/follow/${userId}`, {
      params: {searchValue},
    });
    return data;
  } catch (error: any) {
    console.error('Error fetching follow data:', error.response || error);
    throw error;
  }
};

export const useGetFollowData = (userId: string, searchValue: string = '') => {
  return useQuery({
    queryKey: ['followData', userId, searchValue],
    queryFn: () => getFollowData(userId, searchValue),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!userId, // Only run query if userId is available
  });
};

export const isFollowerIsFollowing = async (userId: string) => {
  try {
    const {data} = await API_AXIOS.get(
      `/follow/isfollowerisfollowing/${userId}`,
    );
    return data;
  } catch (error: any) {
    console.error('Error fetching follow data:', error.response || error);
    throw error;
  }
};

export const useIsFollowerIsFollowing = (userId: string) => {
  return useQuery({
    queryKey: ['isFollowerIsFollowing', userId],
    queryFn: () => isFollowerIsFollowing(userId),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!userId, // Only run query if userId is available
  });
};

export const getPendingFollowRequests = async () => {
  try {
    const {data} = await API_AXIOS.get('/follow/requests');
    return data;
  } catch (error: any) {
    console.error(
      'Error fetching pending follow requests:',
      error.response || error,
    );
    throw error;
  }
};

export const useGetPendingFollowRequests = () => {
  return useQuery({
    queryKey: ['pendingFollowRequests'],
    queryFn: getPendingFollowRequests,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const updateFollowRequest = async (
  userId: string,
  status: 'accepted' | 'rejected',
) => {
  try {
    const {data} = await API_AXIOS.put(`/follow/${userId}`, {status});
    return data;
  } catch (error: any) {
    console.error('Error updating follow request:', error.response || error);
    throw error;
  }
};

export const sendFollowRequest = async (userId: string) => {
  try {
    const {data} = await API_AXIOS.patch(`/follow/${userId}`);
    return data;
  } catch (error: any) {
    console.error('Error sending follow request:', error.response || error);
    throw error;
  }
};

export const getCombinedFollowData = async (searchValue = '') => {
  try {
    const {data} = await API_AXIOS.get('/follow/combined', {
      params: {searchValue},
    });
    return data;
  } catch (error: any) {
    console.error(
      'Error fetching combined follow data:',
      error.response || error,
    );
    throw error;
  }
};

export const useGetCombinedFollowData = (searchValue = '') => {
  return useQuery({
    queryKey: ['combinedFollowData', searchValue],
    queryFn: () => getCombinedFollowData(searchValue),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const cancelFollowRequest = async (userId: string) => {
  try {
    const {data} = await API_AXIOS.get(`/follow/cancel/${userId}`);
    return data;
  } catch (error: any) {
    if (error instanceof Error) {
      console.error('Error cancelling follow request:', error.message); // Log the error message
    } else {
      console.error('Error cancelling follow request:', error); // Log raw error if it's not an instance of Error
    }
    throw error;
  }
};
