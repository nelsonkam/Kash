import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Colors from '../utils/colors';
import Button from './Button';
import NumPad from './NumPad';
import {parse} from '../utils';
import {useNavigation} from '@react-navigation/native';

type Props = {
  limits: {
    min?: number;
    max?: number;
  };
  currency: string;
  onNext: (amount: number) => void;
  buttonText: {
    cancel: string;
    next: string;
  };
  loading?: boolean;
  miniText?: string | null;
  onChange?: (amount: number) => void;
};

function KashPad({
  limits,
  currency,
  onNext,
  buttonText = {cancel: 'Annuler', next: ''},
  loading = false,
  miniText = null,
  onChange,
}: Props) {
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();
  const insufficientFunds = (limits.max || 1) <= 0;

  useEffect(() => {
    if (onChange) {
      onChange(amount);
    }
  }, [amount]);

  const handleNumChange = (num: string) => {
    if (num === 'backspace') {
      setAmount(
        parse(amount.toString().substring(0, amount.toString().length - 1)),
      );
    } else {
      setAmount(parse(`${amount}${num}`));
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flex: 1, paddingBottom: 24}}
      style={{flex: 1, backgroundColor: 'white', position: 'relative'}}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'absolute',
            width: '100%',
          }}>
          {limits.min && amount < limits.min && !insufficientFunds ? (
            <View style={styles.minMaxPill}>
              <Text
                style={{
                  color: Colors.dark,
                  fontFamily: 'Inter-Bold',
                }}>
                {`Minimum: ${currency}` + Math.floor(limits.min)}
              </Text>
            </View>
          ) : null}
          {limits.max && amount > limits.max && !insufficientFunds ? (
            <View style={styles.minMaxPill}>
              <Text
                style={{
                  color: Colors.dark,
                  fontFamily: 'Inter-Bold',
                }}>
                {`Maximum: ${currency}` + Math.floor(limits.max)}
              </Text>
            </View>
          ) : null}
          {insufficientFunds ? (
            <View style={styles.minMaxPill}>
              <Text
                style={{
                  color: Colors.dark,
                  fontFamily: 'Inter-Bold',
                }}>
                {`Fonds insuffisants`}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <View
        style={{flex: 0.65, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.amount}>
          {currency}
          {''}
          <Text style={{color: amount === 0 ? Colors.disabled : Colors.dark}}>
            {amount?.toLocaleString()}
          </Text>
        </Text>
        {miniText && (
          <Text
            style={{
              paddingTop: 12,
              fontFamily: 'Inter-Medium',
              color: Colors.medium,
              fontSize: 16,
            }}>
            {miniText}
          </Text>
        )}
      </View>
      <View style={{flex: 1}}>
        <View
          style={{flexDirection: 'row', marginHorizontal: 8, marginBottom: 8}}>
          <Button
            onPress={() => navigation.goBack()}
            color={Colors.border}
            textColor={Colors.dark}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            {buttonText.cancel}
          </Button>
          <Button
            color={Colors.brand}
            disabled={
              (!!limits.min && amount < limits.min) ||
              (!!limits.max && amount > limits.max)
            }
            loading={loading}
            onPress={() => onNext(amount)}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            {buttonText.next}
          </Button>
        </View>
        <NumPad onChange={handleNumChange} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  amount: {
    fontFamily: 'Inter-Medium',
    fontSize: 40,
    color: Colors.dark,
    paddingHorizontal: 4,
  },
  minMaxPill: {
    marginTop: 16,
    backgroundColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
});

export default KashPad;
