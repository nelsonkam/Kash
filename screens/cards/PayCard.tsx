import {useNavigation, useRoute} from '@react-navigation/native';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';
import React, {useState} from 'react';
import {ChoosePaymentMethod, TransactionStatus} from '../../components/Pay';
import {CardPaymentOperationType} from '../../utils';

function PayCard() {
  const {params} = useRoute();
  // @ts-ignore
  const {id, total, fees, usdAmount, type} = params;
  const navigation = useNavigation();
  const purchaseVirtualCard = useAsync((id, data) =>
    api.post(`/kash/virtual-cards/${id}/purchase/`, data),
  );
  const fundCard = useAsync(data =>
    api.post(`/kash/virtual-cards/${id}/fund/`, data),
  );
  const [txnReference, setTxnReference] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `Payer ${total.currency} ${total.amount}`,
    });
  }, [navigation]);

  const handlePay = (data: any) => {
    if (type === CardPaymentOperationType.fund) {
      fundCard.execute({...data, amount: usdAmount}).then(res => {
        setTxnReference(res.data.txn_ref);
      });
    } else if (type === CardPaymentOperationType.purchase) {
      purchaseVirtualCard
        .execute(id, {...data, amount: usdAmount})
        .then(res => {
          setTxnReference(res.data.txn_ref);
        });
    }
  };
  const handleStatusChanged = () => {
    setTimeout(() => {
      navigation.navigate('Cards');
    }, 1000);
  };
  console.log(
    purchaseVirtualCard.loading,
    fundCard.loading,
    purchaseVirtualCard.loading || fundCard.loading,
  );

  return txnReference ? (
    <TransactionStatus
      reference={txnReference}
      onStatusChanged={handleStatusChanged}
    />
  ) : (
    <ChoosePaymentMethod
      total={total}
      fees={fees}
      nextLoading={purchaseVirtualCard.loading || fundCard.loading}
      onPaymentMethodSelected={handlePay}
    />
  );
}

export default PayCard;
