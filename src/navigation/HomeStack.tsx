import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddStory from '../screens/HomeScreens/AddStory';
import HomeNotifications from '../screens/HomeScreens/HomeNotifications';
import MediaLinksDocs from '../screens/ChatScreens/components/MediaLinksDocs';
import {commonRoute, homeRoute} from '../screens/AuthScreens/routeName';
import ViewStory from '../screens/HomeScreens/ViewStory';
import AllStories from '../screens/HomeScreens/AllStories';
import StoriesSearchScreen from '../screens/HomeScreens/StoriesSearchScreen';
import UsersProfileDetails from '../screens/HomeScreens/UsersProfileDetails';
import SuggestionsList from '../screens/HomeScreens/SuggestionsList';
import AddUsers from '../screens/HomeScreens/AddUsers';
import PendingRequests from '../screens/HomeScreens/PendingRequests';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={homeRoute.AllStories}
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'dark',
        statusBarBackgroundColor: '#fff',
      }}>
      <Stack.Screen name={homeRoute.AllStories} component={AllStories} />
      <Stack.Screen name={homeRoute.AddStory} component={AddStory} />
      <Stack.Screen name={homeRoute.AddUsers} component={AddUsers} />
      <Stack.Screen
        name={homeRoute.PendingRequests}
        component={PendingRequests}
      />
      <Stack.Screen
        name={homeRoute.SuggestionsList}
        component={SuggestionsList}
      />
      <Stack.Screen
        name={homeRoute.StoriesSearchScreen}
        component={StoriesSearchScreen}
      />
      <Stack.Screen
        name={homeRoute.HomeNotifications}
        component={HomeNotifications}
      />
      <Stack.Screen
        name={homeRoute.MediaLinksDocs}
        component={MediaLinksDocs}
      />
      <Stack.Screen name={homeRoute.ViewStory} component={ViewStory} />
      <Stack.Screen
        name={homeRoute.UsersProfileDetails}
        component={UsersProfileDetails}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
