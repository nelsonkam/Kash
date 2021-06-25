import React, {useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ChoosePaymentMethod} from '../../components/Pay';
import ConfirmSheet from '../../components/ConfirmSheet';
import KBottomSheet from '../../components/KBottomSheet';

export function Payout() {
  const {params} = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const {card, usdAmount, xofAmount, currency, fee} = params;
  const confirmRef = useRef<KBottomSheet>(null);
  const [payoutData, setPayoutData] = useState({phone: null, gateway: null});

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `Retirer ${currency} ${xofAmount?.toLocaleString()}`,
      headerBackTitle: '',
    });
  }, [navigation]);

  const handleConfirm = () => {
    confirmRef.current?.close();
    navigation.navigate('ConfirmPin', {
      url: `/kash/virtual-cards/${card.id}/withdraw/`,
      data: {
        ...payoutData,
        amount: usdAmount,
        currency,
      },
      backScreen: 'Cards',
    });
  };

  const handleWithdraw = (data: any) => {
    setPayoutData(data);
    confirmRef.current?.open();
  };

  return (
    <>
      <ChoosePaymentMethod
        total={{amount: xofAmount, currency}}
        fees={{amount: fee, currency: 'XOF'}}
        nextLoading={false}
        onPaymentMethodSelected={handleWithdraw}
        verb={'Retirer'}
      />
      <ConfirmSheet
        ref={confirmRef}
        confirmText={`Tu t'apprêtes à retirer CFA ${xofAmount?.toLocaleString()} sur le numéro suivant: ${
          payoutData.phone
        }`}
        onConfirm={handleConfirm}
        onCancel={() => confirmRef.current?.close()}
      />
    </>
  );
}

export default Payout;
