import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import api from '../../utils/api';
import {useAsync} from '../../utils/hooks';
import {ChoosePaymentMethod, TransactionStatus} from '../../components/Pay';

function PayRequest() {
  const {params} = useRoute();
  // @ts-ignore
  const {id, total, fees} = params;
  const navigation = useNavigation();
  const acceptRequest = useAsync((id, data) =>
    api.post(`/kash/requests/${id}/accept/`, data),
  );
  const [txnReference, setTxnReference] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `Payer ${total.currency} ${total.amount}`,
    });
  }, [navigation]);

  const handlePay = (data: any) => {
    acceptRequest.execute(id, data).then(res => {
      setTxnReference(res.data.txn_ref);
    });
  };
  const handleStatusChanged = () => {
    setTimeout(() => {
      navigation.navigate('Requests');
    }, 1000);
  };

  return txnReference ? (
    <TransactionStatus
      reference={txnReference}
      onStatusChanged={handleStatusChanged}
    />
  ) : (
    <ChoosePaymentMethod
      total={total}
      fees={fees}
      nextLoading={acceptRequest.loading}
      onPaymentMethodSelected={handlePay}
    />
  );
}

export default PayRequest;
