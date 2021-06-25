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
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../utils/store';
import prefsSlice from '../slices/prefs';

type TransactionStatusProps = {
  reference: string;
  onStatusChanged: (transaction: any) => void;
};

export const TransactionStatus = ({
  reference,
  onStatusChanged,
}: TransactionStatusProps) => {
  const transactionQuery = useSWRNative(
    `/kash/qosic-txn/${reference}/`,
    fetcher,
    {
      refreshWhenHidden: false,
      refreshInterval: 1000,
    },
  );
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
  verb?: string;
};

export const PaymentForm = ({
  amount,
  currency,
  onNext,
  loading,
  fees,
  verb,
}: PaymentFormProps) => {
  const [gateway, setGateway] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (gateway && phone) {
      dispatch(prefsSlice.actions.addPaymentMethod({phone, gateway}));
      onNext({gateway, phone});
    }
  };
  return (
    <ScrollView
      style={{
        backgroundColor: 'white',
        padding: 16,
      }}>
      <View style={{marginTop: 16}}>
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
              Frais appliqués: {fees.currency} {fees.amount?.toLocaleString()}
            </Text>
          </View>
        </View>
        <Button
          loading={loading}
          onPress={handleClick}
          disabled={!(gateway && phone)}>
          {verb || 'Payer'} {currency} {amount?.toLocaleString()}
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
  verb?: string;
};

export function ChoosePaymentMethod({
  total,
  fees,
  nextLoading,
  onPaymentMethodSelected,
  verb,
}: ChoosePaymentMethodProps) {
  const paymentMethods = useSelector((s: RootState) => s.prefs.paymentMethods);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const handlePay = () => {
    if (paymentMethod) {
      onPaymentMethodSelected({
        phone: paymentMethod.phone,
        gateway: paymentMethod.gateway,
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
                Utiliser un autre numéro momo
              </Text>
            </TouchableOpacity>
            {paymentMethods.map((item: any) => (
              <ButtonPicker
                onPress={() => setPaymentMethod(item)}
                imageSize={42}
                active={paymentMethod === item}
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
                {fees.currency} {fees.amount?.toLocaleString()}
              </Text>
            </View>
            <Button
              loading={nextLoading}
              onPress={handlePay}
              disabled={!paymentMethod}>
              {verb || 'Payer'} {total.currency}{' '}
              {total.amount?.toLocaleString()}
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
  verb?: boolean;
};

export default function Pay(props: PayProps) {
  const {total, fees, onPay, onStatusChanged, loading} = props;
  const navigation = useNavigation();
  const [txnReference, setTxnReference] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `${props.verb || 'Payer'} ${
        total.currency
      } ${total.amount?.toLocaleString()}`,
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
