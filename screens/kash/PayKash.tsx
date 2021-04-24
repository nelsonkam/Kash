import React from 'react';
import Pay from '../../components/Pay';
import {useNavigation, useRoute} from '@react-navigation/native';
import api from '../../utils/api';
import {useAsync} from '../../utils/hooks';

function PayKash() {
  const {params} = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const {id, total, fees} = params;
  const payKash = useAsync(data => api.post(`/kash/send/${id}/pay/`, data));

  const handlePay = (data: any) => {
    return payKash.execute(data).then(res => res.data);
  };

  const handleStatusChanged = (txn: any) => {
    setTimeout(() => {
      if (txn.status === 'failed') {
        navigation.navigate('Kash');
      } else {
        navigation.navigate('Kash');
      }
    }, 2000);
  };

  return (
    <Pay
      total={total}
      fees={fees}
      onPay={handlePay}
      loading={payKash.loading}
      onStatusChanged={handleStatusChanged}
    />
  );
}

export default PayKash;
