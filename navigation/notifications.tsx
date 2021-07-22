import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Notifications from '../screens/notifications/Notifications';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Stack = createStackNavigator();

export default function ActivityStack() {
  return (
    <Stack.Navigator initialRouteName="Notifications">
      <Stack.Screen
        options={{title: 'Notifications'}}
        name="Notifications"
        component={Notifications}
      />
    </Stack.Navigator>
  );
}
