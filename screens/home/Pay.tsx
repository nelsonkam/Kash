import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/colors';
import useSWRNative from '@nandorojo/swr-react-native';
import api, {fetcher} from '../../utils/api';
import {spaceString} from '../../utils';
import ButtonPicker from '../../components/Picker';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {useAsync} from '../../utils/hooks';
import useSWR from 'swr/esm';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const PaymentForm = ({amount, currency, onNext, loading, fees}) => {
  const [gateway, setGateway] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  return (
    <View
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
            source={require('../../assets/mtn.png')}
            text="MTN Momo"
            active={gateway === 'mtn-bj'}
            onPress={() => setGateway('mtn-bj')}
          />
          <View style={{flex: 4}}></View>
          <ButtonPicker
            style={{
              flex: 48,
            }}
            source={require('../../assets/moov-africa.jpeg')}
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
              Frais d'envoi: {fees.currency} {fees.amount}
            </Text>
          </View>
        </View>
        <Button
          loading={loading}
          onPress={() => onNext({phone, gateway})}
          disabled={!(gateway && phone)}>
          Payer {currency} {amount}
        </Button>
      </View>
    </View>
  );
};

function ChoosePaymentMethod({
  total,
  fees,
  nextLoading,
  onPaymentMethodSelected,
}) {
  const momoAccountQuery = useSWRNative(`/kash/momo-accounts/`, fetcher);
  const [momoAccountId, setMomoAccountId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handlePay = () => {
    if (momoAccountId) {
      const momoAccount = momoAccountQuery.data?.filter(
        item => item.id === momoAccountId,
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
          <TouchableOpacity
            style={{
              alignItems: 'center',
              paddingVertical: 10,
              marginVertical: 6,
            }}
            onPress={() => setShowForm(false)}>
            <Text style={{fontFamily: 'Inter-Bold', color: Colors.primary}}>
              Utiliser un autre moyen de paiement
            </Text>
          </TouchableOpacity>
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
            {momoAccountQuery.data?.map(item => (
              <ButtonPicker
                onPress={() => setMomoAccountId(item.id)}
                imageSize={42}
                active={item.id === momoAccountId}
                style={{marginBottom: 16}}
                source={
                  item.gateway === 'mtn-bj'
                    ? require('../../assets/mtn.png')
                    : item.gateway === 'moov-bj'
                    ? require('../../assets/moov-africa.jpeg')
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
                Frais d'envoi
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

function Pay() {
  const {params} = useRoute();
  const {id, total, fees} = params;
  const navigation = useNavigation();
  const acceptRequest = useAsync((id, data) =>
    api.post(`/kash/requests/${id}/accept/`, data),
  );
  const [txnReference, setTxnReference] = useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `Payer ${total.currency} ${total.amount}`,
    });
  }, [navigation]);

  const handlePay = data => {
    acceptRequest.execute(id, data).then(res => {
      setTxnReference(res.data.txn_ref);
    });
  };
  const handleStatusChanged = () => {
    setTimeout(() => {
      navigation.navigate('Requests');
    }, 1000);
  };

  return txnReference ? (
    <TransactionStatus
      reference={txnReference}
      onStatusChanged={handleStatusChanged}
    />
  ) : (
    <ChoosePaymentMethod
      total={total}
      fees={fees}
      nextLoading={acceptRequest.loading}
      onPaymentMethodSelected={handlePay}
    />
  );
}

export default Pay;
