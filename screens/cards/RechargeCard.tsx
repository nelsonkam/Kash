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

const RechargeCard = ({}) => {
  const {params} = useRoute();
  const [amount, setAmount] = useState(0);
  const [amountXOF, setAmountXOF] = useState(0);
  const [fees, setFees] = useState(0);
  const navigation = useNavigation();
  const limits = {
    min: 5,
    max: 1000,
  };
  const payment = usePayment();
  const fundCard = useAsync(data =>
    api.post(`/kash/virtual-cards/${params.card.id}/fund/`, data),
  );
  const fundingDetails = useAsync(data =>
    api.post(`/kash/virtual-cards/${params.card.id}/funding_details/`, data),
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
  const handleRecharge = () => {
    fundingDetails.execute({amount}).then(res => {
      setAmountXOF(parseInt(res.data.amount, 10));
      setFees(parseInt(res.data.fees, 10));
      payment.viewRef.current?.open();
    });
  };

  const handleStatusChanged = txn => {
    setTimeout(() => {
      payment.viewRef.current?.close();
      navigation.goBack();
    }, 2000);
  };

  const handlePay = (data: {phone: string; gateway: string}) => {
    fundCard.execute({...data, amount}).then(res => {
      payment.setReference(res.data.txn_ref);
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
            disabled={fundingDetails.loading}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            Annuler
          </Button>
          <Button
            color={Colors.brand}
            disabled={amount < limits.min || amount > limits.max}
            onPress={handleRecharge}
            loading={fundingDetails.loading}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            Recharger
          </Button>
        </View>
        <NumPad onChange={handleNumChange} height={320}></NumPad>
      </View>
      <KBottomSheet ref={payment.viewRef} snapPoints={['80%', 0]}>
        <PaymentSheet
          reference={payment.reference}
          loading={fundCard.loading}
          amount={amountXOF}
          fees={fees}
          onPay={handlePay}
          onStatusChanged={handleStatusChanged}
        />
      </KBottomSheet>
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

export default RechargeCard;
