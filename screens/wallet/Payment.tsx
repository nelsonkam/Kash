import React from 'react';
import Pay from '../../components/Pay';
import {useNavigation, useRoute} from '@react-navigation/native';
import api from '../../utils/api';
import {useAsync} from '../../utils/hooks';

function Payment() {
  const {params} = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const {url, total, fees, verb} = params;
  const payKash = useAsync(data => api.post(url, data));

  const handlePay = (data: any) => {
    return payKash
      .execute({...data, amount: total.amount + fees.amount, currency: 'XOF'})
      .then(res => res.data);
  };

  const handleStatusChanged = (txn: any) => {
    setTimeout(() => {
      if (txn.status === 'failed') {
        navigation.navigate('Kash');
      } else {
        navigation.navigate('Kash');
      }
    }, 1500);
  };

  return (
    <Pay
      total={total}
      fees={fees}
      onPay={handlePay}
      loading={payKash.loading}
      onStatusChanged={handleStatusChanged}
      verb={verb}
    />
  );
}

export default Payment;
