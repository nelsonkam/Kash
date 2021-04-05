import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Notifications from '../screens/notifications/Notifications';
import SendRequestKash from '../screens/notifications/SendRequestKash';

const Stack = createStackNavigator();

export default function NotificationStack() {
  return (
    <Stack.Navigator initialRouteName="Cards">
      <Stack.Screen
        options={{title: 'Notifications'}}
        name="Notification"
        component={Notifications}
      />
      <Stack.Screen
        options={{title: ''}}
        name="SendRequestKash"
        component={SendRequestKash}
      />
    </Stack.Navigator>
  );
}
