import React, {useEffect} from 'react';
import {AsyncAction} from '../../components/AsyncActionSheet';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View} from 'react-native';

function RequestKash() {
  const {params} = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const {recipients, amount, note} = params;
  const requestKash = useAsync(data => api.post(`/kash/requests/`, data));
  useEffect(() => {
    requestKash
      .execute({
        recipient_tags: recipients.map((r: any) => r.kashtag),
        note,
        amount,
        amount_currency: 'XOF',
      })
      .finally(() => {
        setTimeout(() => {
          navigation.navigate('Kash');
        }, 2000);
      });
  }, [params]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AsyncAction
        asyncAction={requestKash}
        statusTexts={{
          error: "Oops, nous n'avons pu envoyer ta demande.",
          loading: "Un instant, l'envoi de ta demande est en cours...",
          success: 'Super, ta demande a été envoyé',
        }}
      />
    </View>
  );
}

export default RequestKash;
