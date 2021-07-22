import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Cards from '../screens/cards/Cards';
import NewCard from '../screens/cards/NewCard';
import Colors from '../utils/colors';
import CardDetail from '../screens/cards/CardDetail';
import EditNickname from '../screens/cards/EditNickname';
import {useNavigation} from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';
import RechargeCard from '../screens/cards/RechargeCard';
import Withdrawal from '../screens/cards/Withdrawal';
import PayCard from '../screens/cards/PayCard';
import ListKYCDocs from '../screens/profile/ListKYCDocs';
import VerifyKYCDoc from '../screens/profile/VerifyKYCDoc';
import ConfirmPin from '../screens/shared/ConfirmPin';
import AsyncActionScreen from '../screens/shared/AsyncActionScreen';
import Payout from '../screens/cards/Payout';
import CardHistory from '../screens/cards/CardHistory';
import CardInfo from '../screens/cards/CardInfo';

const Stack = createStackNavigator();

export default function CardStack() {
  return (
    <Stack.Navigator initialRouteName="Cards">
      <Stack.Screen
        options={{title: 'Mes Cartes'}}
        name="Cards"
        component={Cards}
      />
      <Stack.Screen
        options={{title: 'Nouvelle Carte'}}
        name="NewCard"
        component={NewCard}
      />
      <Stack.Screen
        options={{title: ''}}
        name="CardDetail"
        component={CardDetail}
      />
      <Stack.Screen
        options={{title: 'Historique', headerBackTitle: ''}}
        name="CardHistory"
        component={CardHistory}
      />
      <Stack.Screen
        options={{title: 'Informations', headerBackTitle: ''}}
        name="CardInfo"
        component={CardInfo}
      />
      <Stack.Screen
        options={{title: 'Changer le nom'}}
        name="EditNickname"
        component={EditNickname}
      />
      <Stack.Screen
        options={{title: 'Recharger la carte'}}
        name="RechargeCard"
        component={RechargeCard}
      />
      <Stack.Screen
        options={{title: "Retirer de l'argent"}}
        name="Withdrawal"
        component={Withdrawal}
      />
      <Stack.Screen
        options={{title: 'Verifier mon identité'}}
        name="VerifyKYC"
        component={ListKYCDocs}
      />
      <Stack.Screen
        options={{title: 'Vérification'}}
        name="VerifyKYCDoc"
        component={VerifyKYCDoc}
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
      <Stack.Screen options={{title: ''}} name="PayCard" component={PayCard} />
      <Stack.Screen
        options={{title: 'Retirer', headerBackTitle: ''}}
        name="Payout"
        component={Payout}
      />
    </Stack.Navigator>
  );
}
