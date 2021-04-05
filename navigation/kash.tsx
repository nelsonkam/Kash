import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Kash from '../screens/kash/Kash';
import SendRecipient from '../screens/kash/SendRecipient';
import RequestRecipient from '../screens/kash/RequestRecipient';
import {useNavigation} from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';

const Stack = createStackNavigator();

export default function KashStack() {
  const navigation = useNavigation();
  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(notification => {
      navigation.navigate('Notifs');
    });
  }, []);
  return (
    <Stack.Navigator initialRouteName="Cards">
      <Stack.Screen
        options={{headerShown: false}}
        name="Kash"
        component={Kash}
      />
      <Stack.Screen
        options={{title: ''}}
        name="SendRecipient"
        component={SendRecipient}
      />
      <Stack.Screen
        options={{title: ''}}
        name="RequestRecipient"
        component={RequestRecipient}
      />
    </Stack.Navigator>
  );
}
