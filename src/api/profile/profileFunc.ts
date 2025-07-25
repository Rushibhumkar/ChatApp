import {myConsole} from '../../utils/myConsole';
import {API_AXIOS} from '../axiosInstance';
import {useQuery} from '@tanstack/react-query';

export const getProfileDynamicSchema = async () => {
  try {
    const {data} = await API_AXIOS.get('/user/profile-setup-schema');
    return data;
  } catch (error: any) {
    console.error('Error fetching teams:', error.response || error);
    throw error;
  }
};

export const useGetProfileDynamicSchema = () => {
  return useQuery({
    queryKey: ['profileDynamicSchema'],
    queryFn: getProfileDynamicSchema,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const getMyData = async () => {
  try {
    const {data} = await API_AXIOS.get('/user/account');
    return data;
  } catch (error: any) {
    console.error('Error fetching user account data:', error.response || error);
    throw error;
  }
};

export const useGetMyData = () => {
  return useQuery({
    queryKey: ['myData'],
    queryFn: getMyData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const updateUserData = async (userId: string, updatedData: any) => {
  try {
    const response = await API_AXIOS.put(`/user/${userId}`, updatedData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user data:', error.response || error);
    throw error;
  }
};
