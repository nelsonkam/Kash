import React, {useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../utils/colors';
import NumPad from '../../components/NumPad';
import Button from '../../components/Button';
import {parse} from '../../utils';
import {useNavigation} from '@react-navigation/native';

const Kash = () => {
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();
  const handleNumChange = num => {
    if (num === 'backspace') {
      setAmount(
        parse(amount.toString().substring(0, amount.toString().length - 1)),
      );
    } else {
      setAmount(parse(`${amount}${num}`));
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <StatusBar barStyle="dark-content" />
      <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.amount}>
          CFA{' '}
          <Text style={{color: amount === 0 ? Colors.disabled : Colors.dark}}>
            {amount}
          </Text>
        </Text>
      </View>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', marginHorizontal: 8}}>
          <Button
            color={Colors.brand}
            disabled={amount < 25}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            Demander
          </Button>
          <Button
            color={Colors.brand}
            disabled={amount < 25}
            onPress={() => {
              setAmount(0);
              navigation.navigate('SendRecipient', {amount});
            }}
            style={{flex: 1, marginVertical: 8, marginHorizontal: 8}}>
            Envoyer
          </Button>
        </View>
        <NumPad onChange={handleNumChange} height={320}></NumPad>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    height: '25%',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    padding: 28,
    justifyContent: 'center',
  },
  amount: {
    fontFamily: 'Inter-Semibold',
    fontSize: 44,
    color: Colors.dark,
    paddingHorizontal: 4,
  },
});

export default Kash;
