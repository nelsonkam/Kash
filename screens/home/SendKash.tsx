import React, {useState} from 'react';
import {View} from 'react-native';
import KashPad from '../../components/KashPad';
import {useNavigation} from '@react-navigation/native';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';

function SendKash() {
  const navigation = useNavigation();
  const sendKash = useAsync(data => api.post(`/kash/send/`, data), true);
  const handleNext = (amount: number) => {
    navigation.navigate('Pay', {amount, currency: 'CFA '});
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <KashPad
        buttonText={{cancel: 'Annuler', next: 'Envoyer'}}
        currency={'CFA '}
        limits={{min: 25}}
        onNext={handleNext}
      />
    </View>
  );
}

export default SendKash;
