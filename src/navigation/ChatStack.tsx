import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatsList from '../screens/ChatScreens/ChatsList';
import ChattingScreen from '../screens/ChatScreens/ChattingScreen';
import {chatRoute, homeRoute} from '../screens/AuthScreens/routeName';
import ChatsSearchScreen from '../screens/ChatScreens/ChatsSearchScreen';
import MapScreen from '../screens/CommonScreens/MapScreen';

const Stack = createNativeStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'dark',
        statusBarBackgroundColor: '#fff',
      }}
      initialRouteName={chatRoute.ChatsList}>
      <Stack.Screen name={chatRoute.ChatsList} component={ChatsList} />
      <Stack.Screen
        name={chatRoute.ChatsSearchScreen}
        component={ChatsSearchScreen}
      />
      <Stack.Screen name={chatRoute.MapScreen} component={MapScreen} />
      <Stack.Screen
        name={chatRoute.ChattingScreen}
        component={ChattingScreen}
      />
    </Stack.Navigator>
  );
};

export default ChatStack;
