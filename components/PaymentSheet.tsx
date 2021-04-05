import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import Colors from '../utils/colors';
import ButtonPicker from './Picker';
import Input from './Input';
import Button from './Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useSWR from 'swr/esm';
import {fetcher} from '../utils/api';

export const PaymentForm = ({amount, fees, onNext, loading}) => {
  const [gateway, setGateway] = useState(null);
  const [phone, setPhone] = useState(null);
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: Dimensions.get('window').height * 0.8,
      }}>
      <Text
        style={{
          fontFamily: 'Inter-Bold',
          textAlign: 'center',
          fontSize: 18,
          marginTop: 12,
          color: Colors.dark,
        }}>
        Saisis les infos pour le paiement
      </Text>
      <View style={{marginTop: 24}}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            color: Colors.dark,
            marginBottom: 12,
          }}>
          Choisis un opérateur mobile
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <ButtonPicker
            style={{
              flex: 48,
            }}
            source={require('../assets/mtn.png')}
            text="MTN Momo"
            active={gateway === 'mtn-bj'}
            onPress={() => setGateway('mtn-bj')}
          />
          <View style={{flex: 4}}></View>
          <ButtonPicker
            style={{
              flex: 48,
            }}
            source={require('../assets/moov-africa.jpeg')}
            text="Moov Money"
            active={gateway === 'moov-bj'}
            onPress={() => setGateway('moov-bj')}
          />
        </View>
        <View style={{marginVertical: 12}}>
          <Input
            value={phone}
            onChangeText={text => setPhone(text.substring(0, 8))}
            keyboardType={'number-pad'}
            label={'Numéro'}
          />
        </View>
        {fees ? (
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                marginTop: 4,
                marginBottom: 24,
                backgroundColor: Colors.border,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 100,
              }}>
              <Text style={{color: Colors.dark, fontFamily: 'Inter-Bold'}}>
                Frais d'envoi: CFA {fees}
              </Text>
            </View>
          </View>
        ) : null}
        <Button
          loading={loading}
          onPress={() => onNext({phone, gateway})}
          disabled={!(gateway && phone)}>
          Payer CFA {amount}
        </Button>
      </View>
    </View>
  );
};

const TransactionStatus = ({reference, onStatusChanged}) => {
  const transactionQuery = useSWR(`/kash/transactions/${reference}/`, fetcher, {
    refreshInterval: 10,
  });
  const status = transactionQuery.data?.status;

  useEffect(() => {
    if (status === 'failed' || status === 'success') {
      onStatusChanged(transactionQuery.data);
    }
  }, [transactionQuery.data]);
  if (status === 'failed') {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          alignItems: 'center',
          justifyContent: 'center',
          height: Dimensions.get('window').height * 0.8,
        }}>
        <AntDesign name={'closecircle'} color={Colors.danger} size={56} />
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            color: Colors.dark,
            marginVertical: 24,
            fontSize: 16,
            textAlign: 'center',
          }}>
          Oops, ton paiement n'est pas passé.
        </Text>
      </View>
    );
  } else if (status === 'success') {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: Dimensions.get('window').height * 0.8,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AntDesign name={'checkcircle'} color={Colors.success} size={56} />
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            color: Colors.dark,
            marginVertical: 24,
            fontSize: 16,
            textAlign: 'center',
          }}>
          Super, nous avons reçu ton paiement!
        </Text>
      </View>
    );
  } else {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: Dimensions.get('window').height * 0.8,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size={'large'} color={Colors.brand} />
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            color: Colors.dark,
            marginVertical: 24,
            fontSize: 16,
            textAlign: 'center',
          }}>
          Un instant, ton paiement est en cours...
        </Text>
      </View>
    );
  }
};

const PaymentSheet = ({
  amount,
  fees,
  onPay,
  loading,
  reference,
  onStatusChanged,
}) => {
  return (
    <View style={{height: Dimensions.get('window').height * 0.8}}>
      {reference ? (
        <TransactionStatus
          reference={reference}
          onStatusChanged={onStatusChanged}
        />
      ) : (
        <PaymentForm
          fees={fees}
          amount={amount}
          onNext={onPay}
          loading={loading}
        />
      )}
    </View>
  );
};
export default PaymentSheet;
