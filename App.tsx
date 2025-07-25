import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RootNavigator from './src/navigation/RootNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Root as PopupRootProvider} from 'react-native-popup-confirm-toast';
import DeviceInfo from 'react-native-device-info';
import {
  Alert,
  Image,
  LogBox,
  PermissionsAndroid,
  StatusBar,
  View,
} from 'react-native';
import {getData} from './src/hooks/useAsyncStorage';
import AuthStack from './src/navigation/AuthStack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {registerDevice} from './src/api/notification/notificationFunc';
import {myConsole} from './src/utils/myConsole';
import {sizes} from './src/const';

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
        if (token) {
          await getFCMToken();
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        const uniqueId = await DeviceInfo.getUniqueId();
        // console.log('🔥 Unique Device ID:', uniqueId);
      } catch (error) {
        console.error('Error getting Device ID:', error);
      }
    };

    fetchDeviceId();
  }, []);

  useEffect(() => {
    reqPermissionAndroid();
  }, []);

  const reqPermissionAndroid = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Permission Denied');
    }
  };

  const getFCMToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      myConsole('fcmTokenssss', fcmToken);
      if (fcmToken) {
        const platform = 'android';
        await registerDevice(fcmToken, platform);
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  // Foreground Notifications
  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);
      await onDisplayNotification(remoteMessage);
      const event = remoteMessage?.data?.event;
      if (event) myConsole('eventttt', event);
    });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  // Background Notifications
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message:', remoteMessage);
      await onDisplayNotification(remoteMessage);
    });
  }, []);

  useEffect(() => {
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          'Notification caused app to open from background:',
          remoteMessage,
        );
        // Handle navigation if needed
      },
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          // Handle navigation if needed
        }
      });

    return () => {
      unsubscribeNotificationOpened();
    };
  }, []);

  const onDisplayNotification = async (remoteMessage: any) => {
    try {
      await notifee.requestPermission();

      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      await notifee.displayNotification({
        title: remoteMessage?.notification?.title || 'Notification',
        body: remoteMessage?.notification?.body || 'You have a new message.',
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <Image
          source={require('./src/assets/images/splashscreen.png')}
          style={{width: sizes.width, height: sizes.height + 54}}
        />
      </View>
    );
  }

  LogBox.ignoreAllLogs(true);

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#fff'}}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <PopupRootProvider>
            <AppStack userToken={userToken} />
          </PopupRootProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
