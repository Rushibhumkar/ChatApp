import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {homeRoute} from '../screens/AuthScreens/routeName';
import ChatList from '../screens/HomeScreens/ChatList';
import ChatView from '../screens/HomeScreens/ChatView';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={homeRoute.ChatList} component={ChatList} />
      <Stack.Screen name={homeRoute.ChatView} component={ChatView} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
