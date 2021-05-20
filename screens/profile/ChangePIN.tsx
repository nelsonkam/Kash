import React, {useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import Button from '../../components/Button';
import NumPad from '../../components/NumPad';
// @ts-ignore
import {parse} from '../../utils';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import authSlice from '../../slices/auth';
import {PinInput} from '../../components/Input';

const ConfirmPin = ({pin}: {pin: string}) => {
  const navigation = useNavigation();
  const [error, setError] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const dispatch = useDispatch();

  const handleNumChange = (num: string) => {
    if (num === 'backspace') {
      setConfirmPin(
        confirmPin.toString().substring(0, confirmPin.toString().length - 1),
      );
    } else {
      setConfirmPin(`${confirmPin}${num}`);
    }
  };

  const handleNext = () => {
    if (pin === confirmPin) {
      dispatch(authSlice.actions.setPincode(pin));
      navigation.navigate('Profile');
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setConfirmPin('');
      }, 500);
    }
  };

  return (
    <View
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
          Confirme ton code PIN
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <PinInput filled={confirmPin[0]} error={error} />
        <PinInput filled={confirmPin[1]} error={error} />
        <PinInput filled={confirmPin[2]} error={error} />
        <PinInput filled={confirmPin[3]} error={error} />
      </View>
      <View>
        <NumPad onChange={handleNumChange} />
        <View style={{padding: 16, paddingTop: 32}}>
          <Button onPress={handleNext} disabled={pin.length < 4}>
            Terminé
          </Button>
        </View>
      </View>
    </View>
  );
};

function ChangePIN() {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState(false);

  const handleNext = () => {
    setConfirm(true);
  };

  const handleNumChange = (num: string) => {
    if (num === 'backspace') {
      setPin(pin.toString().substring(0, pin.toString().length - 1));
    } else {
      setPin(`${pin}${num}`);
    }
  };

  if (confirm) {
    return <ConfirmPin pin={pin} />;
  }

  return (
    <View
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
          Saisis un code PIN
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <PinInput filled={pin[0]} />
        <PinInput filled={pin[1]} />
        <PinInput filled={pin[2]} />
        <PinInput filled={pin[3]} />
      </View>
      <View>
        <NumPad onChange={handleNumChange} />
        <View style={{padding: 16, paddingTop: 32}}>
          <Button onPress={handleNext} disabled={pin.length < 4}>
            Suivant
          </Button>
        </View>
      </View>
    </View>
  );
}

export default ChangePIN;
