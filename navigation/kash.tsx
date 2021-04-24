import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Kash from '../screens/kash/Kash';
import {useNavigation} from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';
import Home from '../screens/home/Home';
import Recipients from '../screens/kash/Recipients';
import SendKash from '../screens/kash/SendKash';
import KashRecap from '../screens/kash/KashRecap';
import PayKash from '../screens/kash/PayKash';
import RequestKash from '../screens/kash/RequestKash';

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
        options={{headerShown: false}}
        name="Recipients"
        component={Recipients}
      />
      <Stack.Screen
        options={{title: ''}}
        name="SendKash"
        component={SendKash}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="KashRecap"
        component={KashRecap}
      />
      <Stack.Screen name="PayKash" component={PayKash} />
      <Stack.Screen
        options={{title: 'Demander'}}
        name="RequestKash"
        component={RequestKash}
      />
    </Stack.Navigator>
  );
}
