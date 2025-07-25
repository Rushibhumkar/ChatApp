import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddPostMediaScreen from '../screens/PostStack/AddPostMediaScreen';
import ComposePostScreen from '../screens/PostStack/ComposePostScreen';
import {postRoute} from '../screens/AuthScreens/routeName';

const Stack = createNativeStackNavigator();

const PostStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'dark',
        statusBarBackgroundColor: '#fff',
      }}
      initialRouteName={postRoute.AddPostMedia}>
      <Stack.Screen
        name={postRoute.AddPostMedia}
        component={AddPostMediaScreen}
      />
      <Stack.Screen
        name={postRoute.ComposePost}
        component={ComposePostScreen}
      />
    </Stack.Navigator>
  );
};

export default PostStack;
