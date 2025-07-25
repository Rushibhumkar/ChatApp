import {API_AXIOS} from '../axiosInstance';
import {showErrorToast, showSuccessToast} from '../../utils/toastModalFunction';
import {myConsole} from '../../utils/myConsole';
import {useQuery} from '@tanstack/react-query';

export const registerDevice = async (deviceToken: string, platform: string) => {
  try {
    const requestData = {
      deviceToken: deviceToken,
      platform: platform,
    };
    const {data} = await API_AXIOS.post('/notification/devices', requestData);
    // showSuccessToast({description: 'Device registered successfully'});
    // myConsole('lsdkjflkdsf', data);
    return data;
  } catch (error: any) {
    // showErrorToast({description: 'Error registering device'});
    console.log('Error:', error);
    throw error?.response?.data;
  }
};

export const getNotifications = async () => {
  try {
    const {data} = await API_AXIOS.get('/notification/');
    return data;
  } catch (error: any) {
    showErrorToast({description: 'Error fetching notifications'});
    console.log('Error:', error);
    throw error?.response?.data;
  }
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'], // Unique key for the query
    queryFn: getNotifications, // The function that fetches the notifications
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus
    retry: 1, // Retry once on failure
  });
};

export const hideNotification = async (notificationId: string) => {
  try {
    const {data} = await API_AXIOS.put(`/notification/hide/${notificationId}`);
    showSuccessToast({description: 'Notification hidden successfully'});
    // myConsole('Notification hidden:', data);
    return data;
  } catch (error: any) {
    showErrorToast({description: 'Error hiding notification'});
    console.log('Error:', error);
    throw error?.response?.data;
  }
};
