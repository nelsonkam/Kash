import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import Verification from '../screens/Verification';
import GetStarted from '../screens/auth/GetStarted';
import SetupProfile from '../screens/SetupProfile';
import SetupPaymentMethod from '../screens/SetupPaymentMethod';
import InviteCode from '../screens/auth/InviteCode';
import OnboardingScreen from '../screens/auth/Onboarding';
import Signup from '../screens/auth/Signup';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="SetupProfile" component={SetupProfile} />
      <Stack.Screen name="SetupPaymentMethod" component={SetupPaymentMethod} />
      <Stack.Screen name="InviteCode" component={InviteCode} />
    </Stack.Navigator>
  );
}
