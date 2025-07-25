import {useQuery} from '@tanstack/react-query';
import {API_AXIOS} from '../axiosInstance';

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const {data} = await API_AXIOS.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error: any) {
    console.error('Error uploading file:', error.response || error);
    throw error;
  }
};

export const getFile = async (key: string) => {
  try {
    const {data} = await API_AXIOS.get(`/file/fetch/${key}`);
    return data;
  } catch (error: any) {
    console.error('Error fetching file:', error.response || error);
    throw error;
  }
};

export const useGetFile = (key: string) => {
  return useQuery({
    queryKey: ['getFile', key],
    queryFn: () => getFile(key),
    staleTime: 1000 * 60 * 5,
    enabled: !!key,
  });
};

export const deleteFile = async (key: string) => {
  try {
    const {data} = await API_AXIOS.delete(`/file/${key}`);
    return data;
  } catch (error: any) {
    console.error('Error deleting file:', error.response || error);
    throw error;
  }
};
