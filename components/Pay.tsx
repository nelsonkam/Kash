import useSWR from 'swr/esm';
import api, {fetcher} from '../utils/api';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../utils/colors';
import useSWRNative from '@nandorojo/swr-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonPicker from './Picker';
import {spaceString} from '../utils';
import Button from './Button';
import Input from './Input';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAsync} from '../utils/hooks';

type TransactionStatusProps = {
  reference: string;
  onStatusChanged: (transaction: any) => void;
};

export const TransactionStatus = ({
  reference,
  onStatusChanged,
}: TransactionStatusProps) => {
  const transactionQuery = useSWRNative(
    `/kash/transactions/${reference}/`,
    fetcher,
    {
      refreshWhenHidden: false,
    },
  );
  const status = transactionQuery.data?.status;

  useEffect(() => {
    const interval = setInterval(() => {
      transactionQuery.revalidate();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            fontFamily: 'Inter-Semibold',
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
            fontFamily: 'Inter-Semibold',
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
            fontFamily: 'Inter-Semibold',
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

type OnPaymentMethodSelected = (paymentMethod: {
  gateway: string;
  phone: string;
}) => void;

type PaymentFormProps = {
  amount: number;
  currency: string;
  onNext: OnPaymentMethodSelected;
  loading: boolean;
  fees: {
    amount: number;
    currency: string;
  };
};

export const PaymentForm = ({
  amount,
  currency,
  onNext,
  loading,
  fees,
}: PaymentFormProps) => {
  const [gateway, setGateway] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  const handleClick = () => {
    if (gateway && phone) {
      onNext({gateway, phone});
    }
  };
  return (
    <ScrollView
      style={{
        backgroundColor: 'white',
        padding: 16,
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
      <View style={{marginTop: 32}}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            color: Colors.dark,
            marginBottom: 12,
          }}>
          Choisis ton opérateur mobile
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
          <View style={{flex: 4}} />
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
            value={phone || ''}
            onChangeText={text =>
              setPhone(text.replace(/[^\d]/g, '').substring(0, 8))
            }
            keyboardType={'number-pad'}
            label={'Ton numéro momo'}
          />
        </View>
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
              Frais appliqués: {fees.currency} {fees.amount}
            </Text>
          </View>
        </View>
        <Button
          loading={loading}
          onPress={handleClick}
          disabled={!(gateway && phone)}>
          Payer {currency} {amount}
        </Button>
      </View>
    </ScrollView>
  );
};

type ChoosePaymentMethodProps = {
  total: {
    amount: number;
    currency: string;
  };
  fees: {
    amount: number;
    currency: string;
  };
  nextLoading: boolean;
  onPaymentMethodSelected: OnPaymentMethodSelected;
};

export function ChoosePaymentMethod({
  total,
  fees,
  nextLoading,
  onPaymentMethodSelected,
}: ChoosePaymentMethodProps) {
  const momoAccountQuery = useSWRNative(`/kash/momo-accounts/`, fetcher);
  const [momoAccountId, setMomoAccountId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handlePay = () => {
    if (momoAccountId) {
      const momoAccount = momoAccountQuery.data?.filter(
        (item: any) => item.id === momoAccountId,
      )[0];
      onPaymentMethodSelected({
        phone: momoAccount.phone,
        gateway: momoAccount.gateway,
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {showForm ? (
        <>
          <PaymentForm
            fees={fees}
            amount={total.amount}
            currency={total.currency}
            onNext={onPaymentMethodSelected}
            loading={false}
          />
        </>
      ) : (
        <>
          <View style={{padding: 16, paddingBottom: 120}}>
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              style={{
                borderRadius: 6,
                borderColor: Colors.border,
                borderWidth: 2,
                padding: 4,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <View
                style={{
                  height: 42,
                  width: 42,
                  backgroundColor: Colors.lightGrey,
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons color={Colors.primary} name={'add'} size={32} />
              </View>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  color: Colors.dark,
                  fontSize: 16,
                  marginLeft: 12,
                }}>
                Ajouter un moyen de paiement
              </Text>
            </TouchableOpacity>
            {momoAccountQuery.data?.map((item: any) => (
              <ButtonPicker
                onPress={() => setMomoAccountId(item.id)}
                imageSize={42}
                active={item.id === momoAccountId}
                style={{marginBottom: 16}}
                source={
                  item.gateway === 'mtn-bj'
                    ? require('../assets/mtn.png')
                    : item.gateway === 'moov-bj'
                    ? require('../assets/moov-africa.jpeg')
                    : {uri: null}
                }
                text={`+229 ${spaceString(item.phone, 2)}`}
              />
            ))}
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              padding: 8,
              paddingHorizontal: 16,
              height: 108,
              borderTopColor: Colors.border,
              borderTopWidth: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  fontSize: 16,
                  color: Colors.medium,
                }}>
                Frais appliqués
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter-Bold',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                {fees.currency} {fees.amount}
              </Text>
            </View>
            <Button
              loading={nextLoading}
              onPress={handlePay}
              disabled={!momoAccountId}>
              Payer {total.currency} {total.amount}
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

type PayProps = {
  onPay: (data: any) => Promise<Partial<{txn_ref: string}>>;
  onStatusChanged: (txn: any) => void;
  total: {
    amount: number;
    currency: string;
  };
  fees: {
    amount: number;
    currency: string;
  };
  loading: boolean;
};

export default function Pay(props: PayProps) {
  const {total, fees, onPay, onStatusChanged, loading} = props;
  const navigation = useNavigation();
  const [txnReference, setTxnReference] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `Payer ${total.currency} ${total.amount}`,
      headerBackTitle: '',
    });
  }, [navigation]);

  const handlePay = (data: any) => {
    onPay(data).then(({txn_ref}) => {
      setTxnReference(txn_ref!);
    });
  };

  return txnReference ? (
    <TransactionStatus
      reference={txnReference}
      onStatusChanged={onStatusChanged}
    />
  ) : (
    <ChoosePaymentMethod
      total={total}
      fees={fees}
      nextLoading={loading}
      onPaymentMethodSelected={handlePay}
    />
  );
}
