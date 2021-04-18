import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileStack from './profile';
import Home from '../screens/home/Home';
import Requests from '../screens/home/Requests';
import ConfirmRequest from '../screens/home/ConfirmRequest';
import SendKash from '../screens/home/SendKash';
import Pay from '../screens/home/Pay';
import TransactionHistory from '../screens/home/TransactionHistory';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{title: 'Requêtes reçues'}}
        name="Requests"
        component={Requests}
      />
      <Stack.Screen
        options={{title: 'Transactions récentes'}}
        name="TransactionHistory"
        component={TransactionHistory}
      />
      <Stack.Screen
        options={{headerShown: false, headerBackTitle: ''}}
        name="ConfirmRequest"
        component={ConfirmRequest}
      />
      <Stack.Screen
        options={{title: 'Envoyer', headerBackTitle: ''}}
        name="SendKash"
        component={SendKash}
      />
      <Stack.Screen
        options={{title: 'Payer', headerBackTitle: ''}}
        name="Pay"
        component={Pay}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Profile"
        component={ProfileStack}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
