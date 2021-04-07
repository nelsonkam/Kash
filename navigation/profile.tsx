import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '../screens/profile/Profile';
import PaymentMethods from '../screens/profile/PaymentMethods';
import SetupPaymentMethod from '../screens/SetupPaymentMethod';
import AddPayoutMethod from '../screens/profile/AddPayoutMethod';

const Stack = createStackNavigator();

function ProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        options={{title: 'Mon Profil'}}
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
    </Stack.Navigator>
  );
}

export default ProfileStack;
