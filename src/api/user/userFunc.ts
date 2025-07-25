import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {API_AXIOS} from '../axiosInstance';

export const getAllUsers = async (searchValue = '', page = 1, limit = 10) => {
  try {
    const {data} = await API_AXIOS.get('/user/all', {
      params: {
        searchValue,
        page,
        limit,
      },
    });
    return data;
  } catch (error: any) {
    console.error('Error fetching all users:', error.response || error);
    throw error;
  }
};

export const useGetAllUsers = (searchValue = '', limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['allUsers', searchValue, limit], // Query key includes searchValue and limit to refetch when they change
    queryFn: ({pageParam = 1}) => getAllUsers(searchValue, pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      // If the last page contains less than the limit, no more pages are available
      if (lastPage && lastPage.length < limit) {
        return undefined; // No more pages
      }
      return allPages.length + 1; // Next page will be the next index in allPages
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const getUserById = async (userId: string) => {
  try {
    const {data} = await API_AXIOS.get(`/user/${userId}`);
    return data;
  } catch (error: any) {
    console.error(`Error fetching user ${userId}:`, error.response || error);
    throw error;
  }
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ['userById', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId, // only fetch when userId is truthy
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
