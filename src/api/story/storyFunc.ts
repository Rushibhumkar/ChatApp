import {API_AXIOS} from '../axiosInstance';
import {useQuery} from '@tanstack/react-query';

// -----------------------------
// 1. Get All Stories
// -----------------------------
export const getAllStories = async () => {
  try {
    const {data} = await API_AXIOS.get('/story');
    return data;
  } catch (error: any) {
    console.error('Error fetching all stories:', error.response || error);
    throw error;
  }
};

export const useGetAllStories = () => {
  return useQuery({
    queryKey: ['allStories'],
    queryFn: () => getAllStories(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// -----------------------------
// 2. Get Stories by User ID
// -----------------------------
export const getUserStories = async (userId: string) => {
  try {
    const {data} = await API_AXIOS.get(`/story/${userId}`);
    return data;
  } catch (error: any) {
    console.error('Error fetching user stories:', error.response || error);
    throw error;
  }
};

export const useGetUserStories = (userId: string) => {
  return useQuery({
    queryKey: ['userStories', userId],
    queryFn: () => getUserStories(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// -----------------------------
// 3. Update Story (Patch)
// -----------------------------
export const updateStory = async (
  storyId: string,
  updateData: Record<string, any>,
) => {
  try {
    const {data} = await API_AXIOS.patch(`/story/${storyId}`, updateData);
    return data;
  } catch (error: any) {
    console.error('Error updating story:', error.response || error);
    throw error;
  }
};

// -----------------------------
// 4. Delete Story
// -----------------------------
export const deleteStory = async (storyId: string) => {
  try {
    const {data} = await API_AXIOS.delete(`/story/${storyId}`);
    return data;
  } catch (error: any) {
    console.error('Error deleting story:', error.response || error);
    throw error;
  }
};

// -----------------------------
// PATCH: Mark Story as Seen (or any other update)
// -----------------------------
export const markStoryAsSeen = async (storyId: string) => {
  try {
    const {data} = await API_AXIOS.patch(`/story/${storyId}`, {
      seen: true, // or any other field you want to update
    });
    return data;
  } catch (error: any) {
    console.error('Error marking story as seen:', error.response || error);
    throw error;
  }
};
