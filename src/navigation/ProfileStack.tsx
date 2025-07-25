import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TermsAndCond from '../screens/ProfileScreens/TermsAndCond';
import PrivacyPolicy from '../screens/ProfileScreens/PrivacyPolicy';
import ProfileMain from '../screens/ProfileScreens/ProfileMain';
import AccountDetails from '../screens/ProfileScreens/AccountDetails';
import ProfileSetup from '../screens/ProfileScreens/ProfileSetup';
import Blocked from '../screens/ProfileScreens/Blocked';
import {profileRoute} from '../screens/AuthScreens/routeName';
import FollowersCard from '../screens/ProfileScreens/components/FollowersCard';
import FollowersFollowing from '../screens/ProfileScreens/FollowersFollowing';
import RateUs from '../screens/ProfileScreens/RateUs';
import Hierarchy from '../screens/CommonScreens/Hierarchy';
import AddMember from '../screens/CommonScreens/AddMember';
import ProfPostsDetails from '../screens/ProfileScreens/ProfPostsDetails';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={profileRoute.ProfileMain}
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'dark',
        statusBarBackgroundColor: '#fff',
      }}>
      <Stack.Screen name={profileRoute.ProfileMain} component={ProfileMain} />
      <Stack.Screen
        name={profileRoute.ProfPostsDetails}
        component={ProfPostsDetails}
      />
      <Stack.Screen name={profileRoute.Blocked} component={Blocked} />
      <Stack.Screen name={profileRoute.ProfileSetup} component={ProfileSetup} />
      <Stack.Screen name={profileRoute.Hierarchy} component={Hierarchy} />
      <Stack.Screen
        name={profileRoute.PrivacyPolicy}
        component={PrivacyPolicy}
      />
      <Stack.Screen name={profileRoute.RateUs} component={RateUs} />
      <Stack.Screen name={profileRoute.TermsAndCond} component={TermsAndCond} />
      <Stack.Screen name={profileRoute.AddMember} component={AddMember} />
      <Stack.Screen
        name={profileRoute.AccountDetails}
        component={AccountDetails}
      />
      <Stack.Screen
        name={profileRoute.FollowersCard}
        component={FollowersCard}
      />
      <Stack.Screen
        name={profileRoute.FollowersFollowing}
        component={FollowersFollowing}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
