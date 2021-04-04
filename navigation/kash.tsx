import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Kash from '../screens/kash/Kash';
import SendRecipient from '../screens/kash/SendRecipient';

const Stack = createStackNavigator();

export default function KashStack() {
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
    </Stack.Navigator>
  );
}
