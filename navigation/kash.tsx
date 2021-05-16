import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Kash from '../screens/kash/Kash';
import {useNavigation} from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';
import Home from '../screens/wallet/Home';
import Recipients from '../screens/kash/Recipients';
import SendKash from '../screens/kash/SendKash';
import KashRecap from '../screens/kash/KashRecap';
import PayKash from '../screens/kash/PayKash';
import RequestKash from '../screens/kash/RequestKash';
import Requests from '../screens/home/Requests';
import TransactionHistory from '../screens/wallet/TransactionHistory';
import ConfirmRequest from '../screens/home/ConfirmRequest';
import PayRequest from '../screens/home/PayRequest';
import ProfileStack from './profile';
import Deposit from '../screens/wallet/Deposit';
import Payment from '../screens/wallet/Payment';
import Withdraw from '../screens/wallet/Withdraw';

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
        component={Home}
      />
      <Stack.Screen
        options={{title: 'Transactions récentes', headerBackTitle: ''}}
        name="TransactionHistory"
        component={TransactionHistory}
      />
      <Stack.Screen
        options={{title: 'Recharger', headerBackTitle: ''}}
        name="Deposit"
        component={Deposit}
      />
      <Stack.Screen
        options={{title: 'Retirer', headerBackTitle: ''}}
        name="Withdraw"
        component={Withdraw}
      />
      <Stack.Screen
        options={{title: 'Payer', headerBackTitle: ''}}
        name="Payment"
        component={Payment}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Recipients"
        component={Recipients}
      />
      <Stack.Screen name="PayKash" component={PayKash} />
      <Stack.Screen
        options={{title: 'Demander'}}
        name="RequestKash"
        component={RequestKash}
      />
      <Stack.Screen
        options={{title: 'Requêtes reçues', headerBackTitle: ''}}
        name="Requests"
        component={Requests}
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
        component={PayRequest}
      />
    </Stack.Navigator>
  );
}
