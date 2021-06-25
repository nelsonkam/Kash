import React, {useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {parse} from '../../utils';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import Button from '../../components/Button';
import NumPad from '../../components/NumPad';
import PaymentSheet from '../../components/PaymentSheet';
import KBottomSheet from '../../components/KBottomSheet';
import {useAsync, usePayment} from '../../utils/hooks';
import api from '../../utils/api';
import AsyncActionSheet from '../../components/AsyncActionSheet';
import KashPad from '../../components/KashPad';
import ConfirmSheet from '../../components/ConfirmSheet';

const Withdrawal = ({}) => {
  const {params} = useRoute();
  const [amount, setAmount] = useState(0);
  const [xofAmount, setXOFamount] = useState(0);
  const navigation = useNavigation();
  // @ts-ignore
  const card = params.card;
  const limits = {
    min: 1,
    max: Math.floor(parseFloat(card.card_details.amount) - 1),
  };
  const actionRef = useRef<KBottomSheet>(null);
  const confirmRef = useRef<KBottomSheet>(null);
  const withdrawCard = useAsync(data =>
    api.post(`/kash/virtual-cards/${card.id}/withdraw/`, data),
  );
  const convertAmount = useAsync(data =>
    api.post(`/kash/virtual-cards/${card.id}/convert/`, data),
  );

  const handleWithdraw = (amount: number) => {
    setAmount(amount);
    convertAmount
      .execute({amount, currency: 'USD', is_withdrawal: true})
      .then(res => {
        navigation.navigate('Payout', {
          xofAmount: res.data.amount,
          usdAmount: amount,
          card,
          currency: 'XOF',
          fee: 0,
        });
      });
  };

  const handleConfirm = () => {
    confirmRef.current?.close();
    actionRef.current?.open();
    withdrawCard.execute({amount}).then(() => {
      setTimeout(() => {
        actionRef.current?.close();
        navigation.goBack();
      }, 2000);
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', position: 'relative'}}>
      <KashPad
        limits={limits}
        currency={'$'}
        onNext={handleWithdraw}
        buttonText={{
          next: 'Retirer',
          cancel: 'Annuler',
        }}
        loading={convertAmount.loading}
      />
      <ConfirmSheet
        ref={confirmRef}
        confirmText={`Tu t'apprêtes à retirer $${amount} (soit CFA ${xofAmount}) de ta carte.`}
        onConfirm={handleConfirm}
        onCancel={() => confirmRef.current?.close()}
      />
      <AsyncActionSheet
        ref={actionRef}
        statusTexts={{
          loading: 'Un instant, ton retrait est en cours...',
          error: "Oops, nous n'avons pas pu effectuer ton retrait.",
          success: 'Ton retrait a été effectué.',
        }}
        asyncAction={withdrawCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  amount: {
    fontFamily: 'Inter-Semibold',
    fontSize: 44,
    color: Colors.dark,
    paddingHorizontal: 4,
  },
  minMaxPill: {
    marginTop: 28,
    backgroundColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
});

export default Withdrawal;
