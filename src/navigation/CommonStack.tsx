import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SearchScreen from '../screens/CommonScreens/SearchScreen';
import {commonRoute} from '../screens/AuthScreens/routeName';
import AllNotifications from '../screens/CommonScreens/AllNotifications';
import Hierarchy from '../screens/CommonScreens/Hierarchy';
import PermissionsScreen from '../screens/CommonScreens/PermissionsScreen';
import MapScreen from '../screens/CommonScreens/MapScreen';
import NotiDetails from '../screens/CommonScreens/components/NotiDetails';
import UsersProfileDetails from '../screens/HomeScreens/UsersProfileDetails';
import SelectContacts from '../screens/ChatScreens/components/SelectContacts';

const Stack = createNativeStackNavigator();

const CommonStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'dark',
        statusBarBackgroundColor: '#fff',
      }}>
      <Stack.Screen name={commonRoute.SearchScreen} component={SearchScreen} />
      {/* <Stack.Screen name={commonRoute.Hierarchy} component={Hierarchy} /> */}
      <Stack.Screen
        name={commonRoute.SelectContacts}
        component={SelectContacts}
      />
      <Stack.Screen
        name={commonRoute.PermissionsScreen}
        component={PermissionsScreen}
      />
      <Stack.Screen name={commonRoute.NotiDetails} component={NotiDetails} />
      {/* <Stack.Screen name={commonRoute.MapScreen} component={MapScreen} /> */}
      <Stack.Screen
        name={commonRoute.AllNotifications}
        component={AllNotifications}
      />
    </Stack.Navigator>
  );
};

export default CommonStack;
