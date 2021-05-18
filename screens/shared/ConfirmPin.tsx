import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../utils/colors';
import NumPad from '../../components/NumPad';
import {useSelector} from 'react-redux';
import {RootState} from '../../utils/store';
import {useNavigation, useRoute} from '@react-navigation/native';

const PinInput = ({filled, error}: {filled: string; error: boolean}) => {
  const color = filled ? (error ? 'red' : 'black') : 'white';
  return (
    <View
      style={{
        height: 16,
        width: 16,
        backgroundColor: color,
        borderRadius: 24,
        borderColor: error ? 'red' : 'black',
        borderWidth: 1,
        marginHorizontal: 12,
      }}
    />
  );
};

function ConfirmPin() {
  const [error, setError] = useState(false);
  const [pin, setPin] = useState('');
  const auth = useSelector((state: RootState) => state.auth);
  const {params} = useRoute();
  const navigation = useNavigation();

  const handleNumChange = (num: string) => {
    if (num === 'backspace') {
      setPin(pin.toString().substring(0, pin.toString().length - 1));
    } else {
      if (pin.length === 3) {
        setPin(`${pin}${num}`);
        handleNext(`${pin}${num}`);
      } else {
        setPin(`${pin}${num}`);
      }
    }
  };

  const handleNext = (pinCode: string) => {
    if (pinCode !== auth.pincode) {
      setError(true);
      setTimeout(() => {
        setError(false);
        setPin('');
      }, 500);
    } else {
      navigation.navigate('AsyncAction', params);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <View style={{paddingVertical: 16}}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Inter-Bold',
            color: Colors.dark,
            textAlign: 'center',
          }}>
          Saisis ton code PIN
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <PinInput filled={pin[0]} error={error} />
        <PinInput filled={pin[1]} error={error} />
        <PinInput filled={pin[2]} error={error} />
        <PinInput filled={pin[3]} error={error} />
      </View>
      <View>
        <NumPad onChange={handleNumChange} />
      </View>
    </SafeAreaView>
  );
}

export default ConfirmPin;
