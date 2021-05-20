import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Notifications from '../screens/notifications/Notifications';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Requests from '../screens/notifications/Requests';
import PayKashRequest from '../screens/notifications/PayKashRequest';
import ConfirmPin from '../screens/shared/ConfirmPin';
import AsyncActionScreen from '../screens/shared/AsyncActionScreen';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

export default function ActivityStack() {
  return (
    <Stack.Navigator initialRouteName="Activity">
      <Stack.Screen
        options={{title: 'Activité'}}
        name="Activity"
        component={TabStack}
      />
      <Stack.Screen name={'PayKashRequest'} component={PayKashRequest} />
      <Stack.Screen
        options={{headerShown: false, headerBackTitle: ''}}
        name="ConfirmPin"
        component={ConfirmPin}
      />
      <Stack.Screen
        options={{title: 'Opération en cours', headerBackTitle: ''}}
        name="AsyncAction"
        component={AsyncActionScreen}
      />
    </Stack.Navigator>
  );
}

function TabStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Requêtes" component={RequestStack} />
    </Tab.Navigator>
  );
}

function RequestStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name={'Requests'}
        component={Requests}
      />
    </Stack.Navigator>
  );
}
