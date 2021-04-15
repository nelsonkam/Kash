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

const Withdrawal = ({}) => {
  const {params} = useRoute();
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();
  const limits = {
    min: 1,
    max: Math.floor(parseFloat(params.card.card_details.amount) - 1),
  };
  const actionRef = useRef<KBottomSheet>(null);
  const withdrawCard = useAsync(data =>
    api.post(`/kash/virtual-cards/${params.card.id}/withdraw/`, data),
  );

  const handleNumChange = num => {
    if (num === 'backspace') {
      setAmount(
        parse(amount.toString().substring(0, amount.toString().length - 1)),
      );
    } else {
      setAmount(parse(`${amount}${num}`));
    }
  };
  const handleWithdraw = () => {
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
        }}>
        {amount < limits.min ? (
          <View style={styles.minMaxPill}>
            <Text
              style={{
                color: Colors.dark,
                fontFamily: 'Inter-Bold',
              }}>
              {'Minimum: $' + limits.min}
            </Text>
          </View>
        ) : null}
        {amount > limits.max ? (
          <View style={styles.minMaxPill}>
            <Text
              style={{
                color: Colors.dark,
                fontFamily: 'Inter-Bold',
              }}>
              {'Maximum: $' + limits.max}
            </Text>
          </View>
        ) : null}
      </View>
      <View
        style={{flex: 0.65, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.amount}>
          ${' '}
          <Text style={{color: amount === 0 ? Colors.disabled : Colors.dark}}>
            {amount}
          </Text>
        </Text>
      </View>
      <View style={{flex: 1}}>
        <View
          style={{flexDirection: 'row', marginHorizontal: 8, marginBottom: 24}}>
          <Button
            onPress={() => navigation.goBack()}
            color={Colors.border}
            textColor={Colors.dark}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            Annuler
          </Button>
          <Button
            color={Colors.brand}
            disabled={amount < limits.min || amount > limits.max}
            onPress={handleWithdraw}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            Retirer
          </Button>
        </View>
        <NumPad onChange={handleNumChange} height={320}></NumPad>
      </View>
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
