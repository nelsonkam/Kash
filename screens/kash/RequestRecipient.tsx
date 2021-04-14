import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/colors';
import useSWRNative from '@nandorojo/swr-react-native';
import api, {fetcher} from '../../utils/api';
import AntDesign from 'react-native-vector-icons/AntDesign';
import KBottomSheet from '../../components/KBottomSheet';
import Button from '../../components/Button';
import {useAsync} from '../../utils/hooks';
import Avatar from '../../components/Avatar';

const ConfirmSheet = ({
  recipientsQuery,
  recipients,
  amount,
  loading,
  onConfirm,
  onCancel,
}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: 320,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <View
        style={{
          flexDirection: 'row',
          position: 'relative',
          justifyContent: 'center',
        }}>
        {recipientsQuery.data
          ?.filter(r => recipients.includes(r.kashtag))
          .map((profile, index) => (
            <View
              style={{
                position: recipients.length > 1 ? 'absolute' : 'relative',
                right: recipients.length > 1 ? (index + 1) * -16 : 0,
              }}>
              <Avatar profile={profile} size={56} />
            </View>
          ))}
      </View>
      <View
        style={{
          alignItems: 'center',
          marginTop: recipients.length > 1 ? 32 : 0,
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            color: Colors.dark,
            fontSize: 18,
            textAlign: 'center',
          }}>
          Tu t'apprêtes à demander CFA {amount} à{' '}
          {recipients.length === 1
            ? '$' + recipients[0]
            : `${recipients.length} personnes.`}
        </Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button
          textColor={Colors.dark}
          style={{flex: 0.8}}
          disabled={loading}
          onPress={onCancel}
          color={Colors.border}>
          Annuler
        </Button>
        <View style={{flex: 0.1}}></View>
        <Button loading={loading} onPress={onConfirm} style={{flex: 0.8}}>
          Je confirme
        </Button>
      </View>
    </View>
  );
};

const RequestSent = props => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 320,
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
        Super, ta demande a été envoyé!
      </Text>
    </View>
  );
};

function RequestRecipient(props) {
  const {params} = useRoute();
  const navigation = useNavigation();
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const recipientsQuery = useSWRNative(
    `/kash/profiles/current/request_recipients/`,
    fetcher,
  );
  const confirmRef = useRef<KBottomSheet>(null);
  const requestKash = useAsync(data => api.post(`/kash/requests/`, data), true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `CFA ${params.amount}`,
    });
  }, [navigation]);

  const handleSelect = item => {
    if (recipients.includes(item.kashtag)) {
      setRecipients(recipients.filter(i => i !== item.kashtag));
    } else {
      setRecipients([...recipients, item.kashtag]);
    }
  };

  const handleConfirm = () => {
    requestKash
      .execute({
        note,
        recipient_tags: recipients,
        amount: params.amount,
      })
      .then(res => {
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      });
  };

  const handleNext = () => {
    confirmRef.current?.open();
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          padding: 8,
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            fontSize: 16,
            paddingLeft: 8,
            paddingRight: 16,
            flexShrink: 0,
          }}>
          À qui
        </Text>
        <TextInput
          style={{
            fontSize: 16,
            paddingVertical: 8,
            flex: 1,
            color: 'black',
          }}
          value={search}
          onChangeText={text => setSearch(text)}
          placeholderTextColor={Colors.disabled}
          placeholder={'Saisis un nom ou $kashtag pour 🔍'}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          padding: 8,
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            fontSize: 16,
            paddingLeft: 8,
            paddingRight: 16,
            flexShrink: 0,
          }}>
          Pour?
        </Text>
        <TextInput
          style={{
            fontSize: 16,
            paddingVertical: 8,
            flex: 1,
            color: 'black',
          }}
          value={note}
          onChangeText={text => setNote(text)}
          placeholder={'Ajoutes un petit mot 😉'}
          placeholderTextColor={Colors.disabled}
        />
      </View>

      <FlatList
        data={recipientsQuery.data?.filter(r =>
          search ? r.name.includes(search) || r.kashtag.includes(search) : true,
        )}
        keyExtractor={item => item.kashtag}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: Colors.grey,
              width: '100%',
            }}
          />
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 24,
              marginVertical: 56,
            }}>
            <Ionicons name="search" size={64} color={Colors.disabled} />
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                color: Colors.disabled,
                marginTop: 16,
              }}>
              Aucun résultat retrouvé
            </Text>
          </View>
        )}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={{
              padding: 12,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Avatar profile={item} />
            <View
              style={{
                marginLeft: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <View>
                <Text style={{fontFamily: 'Inter-Bold', fontSize: 16}}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    color: Colors.medium,
                    marginTop: 4,
                  }}>
                  ${item.kashtag}
                </Text>
              </View>
              <Ionicons
                name={
                  recipients.includes(item.kashtag)
                    ? 'checkmark-circle'
                    : 'ellipse-outline'
                }
                color={
                  recipients.includes(item.kashtag)
                    ? Colors.brand
                    : Colors.medium
                }
                size={28}
              />
            </View>
          </TouchableOpacity>
        )}
      />
      <View
        style={{
          position: 'relative',
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          padding: 16,
        }}>
        <TouchableOpacity
          disabled={!note || recipients.length === 0}
          onPress={handleNext}
          style={{
            backgroundColor:
              !note || recipients.length === 0 ? Colors.disabled : Colors.brand,
            paddingVertical: 8,
            paddingHorizontal: 18,
            borderRadius: 100,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Bold',
              color: 'white',
              fontSize: 16,
              marginRight: 8,
            }}>
            Demander
          </Text>
          <AntDesign name={'arrowright'} color={'white'} size={24} />
        </TouchableOpacity>
      </View>
      <KBottomSheet ref={confirmRef} snapPoints={[320, 0]}>
        {requestKash.value ? (
          <RequestSent />
        ) : (
          <ConfirmSheet
            amount={params.amount}
            recipientsQuery={recipientsQuery}
            recipients={recipients}
            loading={requestKash.loading}
            onCancel={() => confirmRef.current?.close()}
            onConfirm={handleConfirm}
          />
        )}
      </KBottomSheet>
    </View>
  );
}

export default RequestRecipient;
