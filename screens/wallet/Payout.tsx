import React, {useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ChoosePaymentMethod} from '../../components/Pay';
import ConfirmSheet from '../../components/ConfirmSheet';
import KBottomSheet from '../../components/KBottomSheet';

export function Payout() {
  const {params} = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const {amount, currency, fee} = params;
  const confirmRef = useRef<KBottomSheet>(null);
  const [payoutData, setPayoutData] = useState({phone: null, gateway: null});

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `Retirer ${currency} ${amount?.toLocaleString()}`,
      headerBackTitle: '',
    });
  }, [navigation]);

  const handleConfirm = () => {
    confirmRef.current?.close();
    navigation.navigate('ConfirmPin', {
      url: '/kash/wallets/current/withdraw/',
      data: {
        ...payoutData,
        amount,
        currency,
      },
      backScreen: 'Kash',
    });
  };

  const handleWithdraw = (data: any) => {
    setPayoutData(data);
    confirmRef.current?.open();
  };

  return (
    <>
      <ChoosePaymentMethod
        total={{amount, currency}}
        fees={{amount: fee, currency: 'XOF'}}
        nextLoading={false}
        onPaymentMethodSelected={handleWithdraw}
        verb={'Retirer'}
      />
      <ConfirmSheet
        ref={confirmRef}
        confirmText={`Tu t'apprêtes à retirer ${amount} CFA sur le numéro suivant: ${payoutData.phone}`}
        onConfirm={handleConfirm}
        onCancel={() => confirmRef.current?.close()}
      />
    </>
  );
}

export default Payout;
