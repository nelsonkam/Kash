import React, {useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Avatar, {Avatars} from '../../components/Avatar';
import Colors from '../../utils/colors';
import Button, {BackButton} from '../../components/Button';
import {P2PTxnType} from '../../utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';

function KashRecap() {
  const {top} = useSafeAreaInsets();
  const {params} = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const {type, amount, recipients, groupMode} = params;
  const total =
    groupMode && groupMode === 'pacha' ? amount * recipients.length : amount;
  const [note, setNote] = useState('');
  const [isIncognito, setIncognito] = useState(false);
  const sendKash = useAsync(data => api.post(`/kash/send/`, data), true);
  const recipientsTitle =
    recipients.length === 1
      ? recipients[0].name
      : `${type === P2PTxnType.send ? 'Envoi' : 'Demande'} à ${
          recipients.length
        } personnes`;

  const recipientsSubtitle =
    recipients.length === 1
      ? '$' + recipients[0].kashtag
      : recipients.length === 2
      ? `$${recipients[0].kashtag} et $${recipients[1].kashtag}`
      : `$${recipients[0].kashtag} et ${recipients.length - 1} autres`;

  const handleNext = () => {
    if (type === P2PTxnType.send) {
      sendKash
        .execute({
          note,
          is_incognito: isIncognito,
          recipient_tags: recipients.map((r: any) => r.kashtag),
          amount: amount,
          group_mode: groupMode,
        })
        .then(res => {
          navigation.navigate('PayKash', res.data);
        });
    } else if (type === P2PTxnType.request) {
      navigation.navigate('RequestKash', {recipients, amount: total, note});
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingTop: top}}>
      <View style={{padding: 16, flexDirection: 'row', alignItems: 'center'}}>
        <BackButton style={{flex: 2}} />
        <View style={{flex: 8}}>
          <Text
            style={{
              color: Colors.dark,
              fontFamily: 'Inter-Bold',
              fontSize: 18,
              textAlign: 'center',
            }}>
            Récapitulatif
          </Text>
        </View>
        <View style={{flex: 2}} />
      </View>
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'space-between',
          paddingBottom: 64,
          minHeight: Dimensions.get('screen').height * 0.6,
        }}
        style={{
          flex: 1,
          backgroundColor: 'white',
          padding: 16,
        }}>
        <View style={{alignItems: 'center'}}>
          <Avatars size={72} profiles={recipients} />
          <Text style={{fontFamily: 'Inter-Bold', fontSize: 17, marginTop: 8}}>
            {recipientsTitle}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              color: Colors.medium,
              marginTop: 8,
              fontSize: 15,
            }}>
            {recipientsSubtitle}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 24,
            height: 270,
            justifyContent: 'space-between',
          }}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  marginRight: 6,
                  marginTop: 8,
                  fontFamily: 'Inter-Regular',
                  color: Colors.medium,
                }}>
                CFA
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: 42,
                  color: Colors.dark,
                }}>
                {amount.toLocaleString()}
              </Text>
            </View>
            <View
              style={{
                borderColor: Colors.border,
                borderWidth: 2,
                padding: 12,
                paddingHorizontal: 16,
                borderRadius: 16,
                minWidth: 180,
                marginTop: 24,
              }}>
              <TextInput
                value={note}
                onChangeText={setNote}
                style={{
                  fontSize: 16,
                  fontFamily: 'Inter-Regular',
                  color: 'black',
                }}
                textAlign={'center'}
                placeholderTextColor={Colors.medium}
                placeholder={
                  type === P2PTxnType.send
                    ? 'Ajoutes un petit mot'
                    : 'Besoin de kash pour?'
                }
              />
            </View>
          </View>
          {type === P2PTxnType.send && (
            <TouchableOpacity
              onPress={() => setIncognito(!isIncognito)}
              style={{
                borderColor: isIncognito ? Colors.brand : Colors.border,
                backgroundColor: isIncognito ? Colors.brand : 'white',
                borderWidth: 2,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 100,
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: 16,
                  color: isIncognito ? 'white' : Colors.dark,
                }}>
                Mode incognito {isIncognito ? 'activé' : 'desactivé'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View />
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: 12,
          paddingHorizontal: 16,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          backgroundColor: 'white',
        }}>
        <Button
          disabled={!note}
          loading={sendKash.loading}
          onPress={handleNext}>
          {type === P2PTxnType.send ? 'Payer' : 'Demander'} CFA{' '}
          {total.toLocaleString()}
        </Button>
      </View>
    </View>
  );
}

export default KashRecap;
