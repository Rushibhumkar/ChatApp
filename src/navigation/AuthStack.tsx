import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/AuthScreens/Login';

const Stack = createNativeStackNavigator();

type AuthStackProps = {
  onLogin: () => void;
};

const AuthStack = ({onLogin}: AuthStackProps) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        statusBarBackgroundColor: '#fff',
        statusBarStyle: 'dark',
      }}>
      <Stack.Screen
        name="Login"
        component={(props: any) => <Login {...props} onLogin={onLogin} />}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
