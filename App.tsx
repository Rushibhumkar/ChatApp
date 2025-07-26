import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RootNavigator from './src/navigation/RootNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Root as PopupRootProvider} from 'react-native-popup-confirm-toast';
import {LogBox, StatusBar, View} from 'react-native';
import {getData} from './src/hooks/useAsyncStorage';
import AuthStack from './src/navigation/AuthStack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import CustomText from './src/components/CustomText';
import {SocketProvider} from './src/context/SocketProvider';

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

const AppStack = ({userToken}: any) => (
  <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName={userToken ? 'Main' : 'Auth'}>
    <Stack.Screen name="Main" component={RootNavigator} />
    <Stack.Screen name="Auth" component={AuthStack} />
  </Stack.Navigator>
);

const App = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getData('authToken');
        setUserToken(token);
      } catch (error) {
        console.log('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <CustomText>ChatApp</CustomText>
      </View>
    );
  }

  LogBox.ignoreAllLogs(true);

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#fff'}}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <PopupRootProvider>
            <SocketProvider>
              <AppStack userToken={userToken} />
            </SocketProvider>
          </PopupRootProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
