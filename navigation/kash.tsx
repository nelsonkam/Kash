import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';
import Home from '../screens/wallet/Home';
import Recipients from '../screens/wallet/Recipients';
import SendKash from '../screens/wallet/SendKash';
import Requests from '../screens/notifications/Requests';
import TransactionHistory from '../screens/wallet/TransactionHistory';
import Deposit from '../screens/wallet/Deposit';
import Payment from '../screens/wallet/Payment';
import Withdraw from '../screens/wallet/Withdraw';
import ConfirmPin from '../screens/shared/ConfirmPin';
import AsyncActionScreen from '../screens/shared/AsyncActionScreen';
import TransactionDetail from '../screens/wallet/TransactionDetail';
import RequestKash from '../screens/wallet/RequestKash';
import Payout from '../screens/wallet/Payout';

const Stack = createStackNavigator();

export default function KashStack() {
  const navigation = useNavigation();
  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(notification => {
      navigation.navigate('Notifs');
    });
  }, []);
  return (
    <Stack.Navigator initialRouteName="Kash">
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
        options={{title: 'Retirer', headerBackTitle: ''}}
        name="Payout"
        component={Payout}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Recipients"
        component={Recipients}
      />
      <Stack.Screen
        options={{title: 'Requêtes reçues', headerBackTitle: ''}}
        name="Requests"
        component={Requests}
      />

      <Stack.Screen
        options={{title: 'Envoyer', headerBackTitle: ''}}
        name="SendKash"
        component={SendKash}
      />
      <Stack.Screen
        options={{title: 'Transaction', headerBackTitle: ''}}
        name="TransactionDetail"
        component={TransactionDetail}
      />

      <Stack.Screen
        options={{title: 'Demander'}}
        name="RequestKash"
        component={RequestKash}
      />
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
