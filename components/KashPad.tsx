import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
};

function KashPad({
  limits,
  currency,
  onNext,
  buttonText = {cancel: 'Annuler', next: ''},
}: Props) {
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();

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
    <View style={{flex: 1, backgroundColor: 'white', position: 'relative'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
        }}>
        {limits.min && amount < limits.min ? (
          <View style={styles.minMaxPill}>
            <Text
              style={{
                color: Colors.dark,
                fontFamily: 'Inter-Bold',
              }}>
              {`Minimum: ${currency}` + limits.min}
            </Text>
          </View>
        ) : null}
        {limits.max && amount > limits.max ? (
          <View style={styles.minMaxPill}>
            <Text
              style={{
                color: Colors.dark,
                fontFamily: 'Inter-Bold',
              }}>
              {`Maximum: ${currency}` + limits.max}
            </Text>
          </View>
        ) : null}
      </View>
      <View
        style={{flex: 0.65, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.amount}>
          {currency}{' '}
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
            {buttonText.cancel}
          </Button>
          <Button
            color={Colors.brand}
            disabled={
              (!!limits.min && amount < limits.min) ||
              (!!limits.max && amount > limits.max)
            }
            onPress={() => onNext(amount)}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            {buttonText.next}
          </Button>
        </View>
        <NumPad onChange={handleNumChange} height={320}></NumPad>
      </View>
    </View>
  );
}

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

export default KashPad;