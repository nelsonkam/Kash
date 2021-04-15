import React, {useState} from 'react';
import {TouchableOpacity, View, Text, Image, Dimensions} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/colors';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';
import {spaceString} from '../../utils';
import ButtonPicker from '../../components/Picker';
import Button from '../../components/Button';
import Input from '../../components/Input';

export const PaymentForm = ({amount, onNext, loading, fees = 0}) => {
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
              Frais d'envoi: CFA {fees}
            </Text>
          </View>
        </View>
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

function Pay(props) {
  const navigation = useNavigation();
  const {params} = useRoute();
  const momoAccountQuery = useSWRNative(`/kash/momo-accounts/`, fetcher);
  const {amount, currency} = params;
  const [momoAccountId, setMomoAccountId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `Payer ${currency}${amount}`,
    });
  }, [navigation]);

  const handlePay = () => {};

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {showForm ? (
        <>
          <PaymentForm amount={amount} onNext={handlePay} loading={false} />
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
                CFA 300
              </Text>
            </View>
            <Button disabled={!momoAccountId}>
              Payer {currency} {amount}
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

export default Pay;
