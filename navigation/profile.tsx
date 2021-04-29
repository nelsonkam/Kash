import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '../screens/profile/Profile';
import PaymentMethods from '../screens/profile/PaymentMethods';
import AddPayoutMethod from '../screens/profile/AddPayoutMethod';
import ListKYCDocs from '../screens/profile/ListKYCDocs';
import VerifyKYCDoc from '../screens/profile/VerifyKYCDoc';
import AddPhone from '../screens/auth/AddPhone';
import Verification from '../screens/auth/Verification';

const Stack = createStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        options={{title: 'Mon Profil', headerBackTitle: ''}}
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        options={{title: 'Mes comptes momo'}}
        name="PaymentMethods"
        component={PaymentMethods}
      />
      <Stack.Screen
        options={{title: 'Ajouter un compte'}}
        name="AddPaymentMethod"
        component={AddPayoutMethod}
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
        options={{headerShown: false}}
        initialParams={{stack: 'profile'}}
        name="AddPhone"
        component={AddPhone}
      />
      <Stack.Screen
        initialParams={{stack: 'profile'}}
        options={{headerShown: false}}
        name="Verification"
        component={Verification}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
