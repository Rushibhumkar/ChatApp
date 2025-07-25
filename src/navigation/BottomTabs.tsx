import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {color} from '../const/color';
import {
  chatRoute,
  commonRoute,
  homeRoute,
  postRoute,
  profileRoute,
} from '../screens/AuthScreens/routeName';
import ProfileStack from './ProfileStack';
import HomeStack from './HomeStack';
import ChatStack from './ChatStack';
import PostStack from './PostStack';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingBottom: 5,
          display: getRouteName(route),
        },
        tabBarActiveTintColor: color.mainColor,
        tabBarInactiveTintColor: '#A0A0A0',
      })}
      initialRouteName="HomeStack">
      <Tab.Screen
        name="PostStack"
        component={PostStack}
        options={{
          tabBarLabel: 'Add post',
          tabBarIcon: ({focused, size}) =>
            focused ? (
              <Image
                source={require('../assets/bottomIcons/plusActive.png')}
                style={{height: 24, width: 24}}
              />
            ) : (
              <Image
                source={require('../assets/bottomIcons/plusInactive.png')}
                style={{height: 24, width: 24}}
              />
            ),
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(postRoute.PostStack, {
              screen: postRoute.AddPostMedia,
            });
          },
        })}
      />
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Stories',
          tabBarIcon: ({focused, size}) =>
            focused ? (
              <Image
                source={require('../assets/bottomIcons/storyActive.png')}
                style={{height: 24, width: 24}}
              />
            ) : (
              <Image
                source={require('../assets/bottomIcons/storyInactive.png')}
                style={{height: 24, width: 24}}
              />
            ),
        }}
      />
      <Tab.Screen
        name="ChatStack" // This should be the same as your route name
        component={ChatStack} // This should be the ChatStack navigator component
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({focused, size}) =>
            focused ? (
              <Image
                source={require('../assets/bottomIcons/messageActive.png')}
                style={{height: 24, width: 24}}
              />
            ) : (
              <Image
                source={require('../assets/bottomIcons/messageInactive.png')}
                style={{height: 24, width: 24}}
              />
            ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused, size}) =>
            focused ? (
              <Image
                source={require('../assets/bottomIcons/bottomUserActive.png')}
                style={{height: 24, width: 24}}
              />
            ) : (
              <Image
                source={require('../assets/bottomIcons/bottomUserInactive.png')}
                style={{height: 24, width: 24}}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const getRouteName = (route: any) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  // console.log({routeName});
  if (
    routeName === commonRoute.SearchScreen ||
    routeName === commonRoute.AllNotifications ||
    routeName === profileRoute.Hierarchy ||
    routeName === homeRoute.UsersProfileDetails ||
    routeName === profileRoute.Blocked ||
    routeName === profileRoute.AccountDetails ||
    routeName === homeRoute.AddStory ||
    routeName === profileRoute.ProfileSetup ||
    routeName === profileRoute.RateUs ||
    routeName === profileRoute.ProfPostsDetails ||
    routeName === profileRoute.AddMember ||
    routeName === homeRoute.ViewStory ||
    routeName === homeRoute.HomeNotifications ||
    routeName === homeRoute.PendingRequests ||
    routeName === homeRoute.AddUsers ||
    routeName === commonRoute.NotiDetails ||
    routeName === commonRoute.SelectContacts ||
    routeName === chatRoute.ChattingScreen ||
    routeName === postRoute.AddPostMedia ||
    routeName === postRoute.ComposePost ||
    routeName === chatRoute.MapScreen
  ) {
    return 'none';
  } else {
    return 'flex';
  }
};

export default BottomTabs;
