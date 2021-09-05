import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '../screens/profile/Profile';
import PaymentMethods from '../screens/profile/PaymentMethods';
import AddPayoutMethod from '../screens/profile/AddPayoutMethod';
import ListKYCDocs from '../screens/profile/ListKYCDocs';
import VerifyKYCDoc from '../screens/profile/VerifyKYCDoc';
import AddPhone from '../screens/auth/AddPhone';
import Verification from '../screens/auth/Verification';
import EditProfile from '../screens/profile/EditProfile';
import Security from '../screens/profile/Security';
import ConfirmPassword from '../screens/shared/ConfirmPassword';
import SetupPin from '../screens/auth/SetupPin';
import ChangePIN from '../screens/profile/ChangePIN';
import ReferralProgram from '../screens/profile/ReferralProgram';
import PromoCode from '../screens/profile/PromoCode';

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
        options={{title: 'Modifier mon profil'}}
        name="EditProfile"
        component={EditProfile}
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
      <Stack.Screen
        options={{title: 'Sécurité'}}
        name="Security"
        component={Security}
      />
      <Stack.Screen
        options={{title: 'Parrainage'}}
        name="ReferralProgram"
        component={ReferralProgram}
      />
      <Stack.Screen
        options={{title: 'Code Promo'}}
        name="PromoCode"
        component={PromoCode}
      />
      <Stack.Screen
        options={{title: 'Modification de code PIN'}}
        name="ChangePIN"
        component={ChangePIN}
      />
      <Stack.Screen
        options={{title: 'Mot de passe'}}
        name="ConfirmPassword"
        component={ConfirmPassword}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
