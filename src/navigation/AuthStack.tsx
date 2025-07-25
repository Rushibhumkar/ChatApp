import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/AuthScreens/Login';
import Signup from '../screens/AuthScreens/Signup';
import VerificationCode from '../screens/AuthScreens/VerificationCode';
import ResetPassword from '../screens/AuthScreens/ResetPassword';
import SetupProfile from '../screens/AuthScreens/SetupProfile';
import ForgotPassword from '../screens/AuthScreens/ForgetPassword';

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
        // Pass `onLogin` to the Login screen
        component={(props: any) => <Login {...props} onLogin={onLogin} />}
      />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerificationCode" component={VerificationCode} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen
        name="SetupProfile"
        component={(props: any) => (
          <SetupProfile {...props} onLogin={onLogin} />
        )}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
