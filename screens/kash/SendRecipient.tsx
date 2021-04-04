import React, {useRef, useState} from 'react';
import {TouchableOpacity, Text, View, TextInput, FlatList} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/colors';
import useSWRNative from '@nandorojo/swr-react-native';
import api, {fetcher} from '../../utils/api';
import AntDesign from 'react-native-vector-icons/AntDesign';
import KBottomSheet from '../../components/KBottomSheet';
import Button from '../../components/Button';
import {useAsync} from '../../utils/hooks';
import PaymentSheet from '../../components/PaymentSheet';

const Avatar = ({profile, size = 42}) => {
  return (
    <View
      style={{
        height: size,
        width: size,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        flexShrink: 0,
        borderColor: 'white',
        borderWidth: 1,
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: 20,
          fontFamily: 'Inter-Bold',
        }}>
        {profile?.name[0]}
      </Text>
    </View>
  );
};

const ConfirmSheet = ({
  recipientsQuery,
  recipients,
  amount,
  loading,
  onConfirm,
}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: 340,
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
                marginBottom: 12,
              }}>
              <Avatar profile={profile} size={56} />
            </View>
          ))}
      </View>
      <View style={{alignItems: 'center', marginTop: 32}}>
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            color: Colors.dark,
            fontSize: 18,
            textAlign: 'center',
          }}>
          Tu t'apprêtes à envoyer CFA {amount} (en tout) à{' '}
          {recipients.length === 1
            ? '$' + recipients[0]
            : `${recipients.length} personnes.`}
        </Text>
        <View
          style={{
            marginTop: 28,
            backgroundColor: Colors.border,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 100,
          }}>
          <Text style={{color: Colors.dark, fontFamily: 'Inter-Bold'}}>
            Frais d'envoi: CFA{' '}
            {amount * 0.03 < 100 ? 0 : Math.floor(amount * 0.03)}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button
          textColor={Colors.dark}
          style={{flex: 0.8}}
          disabled={loading}
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

function SendRecipient(props) {
  const {params} = useRoute();
  const navigation = useNavigation();
  const [incognito, setIncognito] = useState(false);
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [groupMode, setGroupMode] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const recipientsQuery = useSWRNative(
    `/kash/profiles/current/send_recipients/`,
    fetcher,
  );
  const [kashTxn, setKashTxn] = useState(null);
  const confirmRef = useRef<KBottomSheet>(null);
  const paymentRef = useRef<KBottomSheet>(null);
  const groupSendRef = useRef<KBottomSheet>(null);
  const sendKash = useAsync(data => api.post(`/kash/send/`, data), true);
  const [txnRef, setTxnRef] = useState(null);
  const payKashTxn = useAsync((id, data) =>
    api.post(`/kash/send/${id}/pay/`, data),
  );

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
    sendKash
      .execute({
        note,
        is_incognito: incognito,
        recipient_tags: recipients,
        amount: params.amount,
        group_mode: groupMode,
      })
      .then(res => {
        setKashTxn(res.data);
        paymentRef.current?.open();
      });
  };

  const handlePay = data => {
    payKashTxn.execute(kashTxn.id, data).then(res => {
      setTxnRef(res.data.txn_ref);
    });
  };

  const handleNext = () => {
    if (recipients.length === 1) {
      confirmRef.current?.open();
    } else {
      groupSendRef.current?.open();
    }
  };

  const handleGroupNext = () => {
    groupSendRef.current?.close();
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
          }}
          value={note}
          onChangeText={text => setNote(text)}
          placeholder={'Ajoutes un petit mot 😉'}
          placeholderTextColor={Colors.disabled}
        />
      </View>
      <TouchableOpacity
        onPress={() => setIncognito(!incognito)}
        activeOpacity={0.6}
        style={{
          flexDirection: 'row',
          padding: 16,
          paddingVertical: 12,
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            fontSize: 16,
            flexShrink: 0,
          }}>
          Envoyer en mode incognito
        </Text>
        <Ionicons
          name={incognito ? 'checkmark-circle' : 'ellipse-outline'}
          color={incognito ? Colors.brand : Colors.medium}
          size={28}
        />
      </TouchableOpacity>
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
            Envoyer
          </Text>
          <AntDesign name={'arrowright'} color={'white'} size={24} />
        </TouchableOpacity>
      </View>
      <KBottomSheet ref={confirmRef} snapPoints={[340, 0]}>
        <ConfirmSheet
          amount={
            groupMode === 'pacha'
              ? params.amount * recipients.length
              : params.amount
          }
          recipientsQuery={recipientsQuery}
          recipients={recipients}
          loading={sendKash.loading}
          onConfirm={handleConfirm}
        />
      </KBottomSheet>
      <KBottomSheet ref={paymentRef} snapPoints={['70%', 0]}>
        <PaymentSheet
          reference={txnRef}
          amount={kashTxn?.total?.amount}
          onPay={handlePay}
          loading={payKashTxn.loading}
          onStatusChanged={() => {
            setTimeout(() => {
              navigation.goBack();
            }, 2000);
          }}
        />
      </KBottomSheet>
      <KBottomSheet ref={groupSendRef} snapPoints={[480, 0]}>
        <View
          style={{
            height: 480,
            backgroundColor: 'white',
            padding: 16,
            paddingTop: 32,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Bold',
              textAlign: 'center',
              fontSize: 18,
              marginTop: 12,
              color: Colors.dark,
            }}>
            Envoyer à plusieurs personnes
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              textAlign: 'center',
              fontSize: 16,
              marginTop: 16,
              color: Colors.medium,
            }}>
            Choisis un mode d'envoi
          </Text>

          <View style={{marginTop: 24}}>
            <TouchableOpacity
              onPress={() => setGroupMode('normal')}
              activeOpacity={0.6}
              style={{
                flexDirection: 'row',
                padding: 12,
                paddingVertical: 12,
                borderColor: Colors.border,
                borderWidth: 2,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 8,
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Inter-Bold',
                    fontSize: 17,
                  }}>
                  Normal 💰 –{'  '}CFA {params.amount}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    color: Colors.medium,
                    fontSize: 14,
                    marginTop: 6,
                  }}>
                  Chaque personne reçoit CFA{' '}
                  {Math.floor(params.amount / recipients.length)}
                </Text>
              </View>
              <Ionicons
                name={
                  groupMode === 'normal'
                    ? 'checkmark-circle'
                    : 'ellipse-outline'
                }
                color={groupMode === 'normal' ? Colors.brand : Colors.medium}
                size={28}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGroupMode('pacha')}
              activeOpacity={0.6}
              style={{
                flexDirection: 'row',
                padding: 12,
                paddingVertical: 12,
                borderColor: Colors.border,
                borderWidth: 2,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 8,
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Inter-Bold',
                    fontSize: 17,
                  }}>
                  Pacha 🤑 –{'  '}CFA {params.amount * recipients.length}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    color: Colors.medium,
                    fontSize: 14,
                    marginTop: 6,
                  }}>
                  Chaque personne reçoit CFA {params.amount}
                </Text>
              </View>
              <Ionicons
                name={
                  groupMode === 'pacha' ? 'checkmark-circle' : 'ellipse-outline'
                }
                color={groupMode === 'pacha' ? Colors.brand : Colors.medium}
                size={28}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGroupMode('faro')}
              activeOpacity={0.6}
              style={{
                flexDirection: 'row',
                padding: 12,
                paddingVertical: 12,
                borderColor: Colors.border,
                borderWidth: 2,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 8,
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Inter-Bold',
                    fontSize: 17,
                  }}>
                  Faro Faro 💸 –{'  '}CFA {params.amount}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    color: Colors.medium,
                    fontSize: 14,
                    marginTop: 6,
                  }}>
                  Chaque personne reçoit une somme aléatoire
                </Text>
              </View>
              <View style={{width: 28, flexShrink: 0}}>
                <Ionicons
                  name={
                    groupMode === 'faro'
                      ? 'checkmark-circle'
                      : 'ellipse-outline'
                  }
                  color={groupMode === 'faro' ? Colors.brand : Colors.medium}
                  size={28}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 16}}>
            <Button disabled={!groupMode} onPress={handleGroupNext}>
              Suivant
            </Button>
          </View>
        </View>
      </KBottomSheet>
    </View>
  );
}

export default SendRecipient;
