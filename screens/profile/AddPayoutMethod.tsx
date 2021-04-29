import React from 'react';
import {View} from 'react-native';
import {CreatePaymentMethod} from '../auth/SetupPaymentMethod';
import {useNavigation} from '@react-navigation/native';

function AddPayoutMethod(props) {
  const nav = useNavigation();
  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 16}}>
      <CreatePaymentMethod onCreated={() => nav.goBack()} />
    </View>
  );
}

export default AddPayoutMethod;
