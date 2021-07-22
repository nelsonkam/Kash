import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../utils/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import CreditCard from '../../components/CreditCard';
import api, {fetcher} from '../../utils/api';
import KBottomSheet from '../../components/KBottomSheet';
import {isToday, spaceFour} from '../../utils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncActionSheet from '../../components/AsyncActionSheet';
import {useAsync} from '../../utils/hooks';
import useSWRNative from '@nandorojo/swr-react-native';
import ConfirmSheet from '../../components/ConfirmSheet';

function CardDetail() {
  const {params} = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const cardId = params.card.id;
  const [currentTab, setTab] = useState<'statement' | 'transactions'>(
    'statement',
  );
  const cardQuery = useSWRNative(`/kash/virtual-cards/${cardId}/`, fetcher);
  const transactionsQuery = useSWRNative(
    `/kash/virtual-cards/${cardId}/transactions/`,
    fetcher,
  );
  const statementQuery = useSWRNative(
    `/kash/virtual-cards/${cardId}/statement/`,
    fetcher,
  );
  const freezeCard = useAsync(() =>
    api.post(`/kash/virtual-cards/${cardId}/freeze/`),
  );
  const unfreezeCard = useAsync(() =>
    api.post(`/kash/virtual-cards/${cardId}/unfreeze/`),
  );
  const terminateCard = useAsync(() =>
    api.post(`/kash/virtual-cards/${cardId}/terminate/`),
  );
  const menuRef = useRef<KBottomSheet>(null);
  const detailsRef = useRef<KBottomSheet>(null);
  const freezeActionRef = useRef<KBottomSheet>(null);
  const unfreezeActionRef = useRef<KBottomSheet>(null);
  const terminateActionRef = useRef<KBottomSheet>(null);
  const terminateConfirmRef = useRef<KBottomSheet>(null);
  // @ts-ignore
  const card = cardQuery.data || params.card;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: card.nickname,
    });
  }, [navigation, card]);

  const handleFreezeToggle = () => {
    menuRef.current?.close();
    if (card.is_active) {
      freezeActionRef.current?.open();
      freezeCard
        .execute()
        .then(() => {
          cardQuery.mutate();
        })
        .finally(() => {
          setTimeout(() => freezeActionRef.current?.close(), 1000);
        });
    } else {
      unfreezeActionRef.current?.open();
      unfreezeCard
        .execute()
        .then(() => {
          cardQuery.mutate();
        })
        .finally(() => {
          setTimeout(() => unfreezeActionRef.current?.close(), 1000);
        });
    }
  };

  if (transactionsQuery.data && statementQuery.data) {
    return (
      <>
        <ScrollView
          style={{flex: 1, backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}>
          {!card.is_active && (
            <View style={{backgroundColor: Colors.warning, padding: 12}}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Inter-Semibold',
                  textAlign: 'center',
                }}>
                Cette carte est désactivée
              </Text>
            </View>
          )}
          <View
            style={{
              padding: 16,
              paddingBottom: 8,
              backgroundColor: 'white',
            }}>
            <CreditCard card={card} />
            <View
              style={{
                marginVertical: 12,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-Bold',
                  color: Colors.dark,
                  marginTop: 8,
                  fontSize: 16,
                }}>
                Solde actuel
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter-Semibold',
                  color: Colors.dark,
                  marginTop: 8,
                  fontSize: 16,
                }}>
                {card.card_details.amount} {card.card_details.currency}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: Colors.border,
              width: '100%',
            }}
          />
          <View
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 16,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CardInfo', {card});
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomColor: Colors.border,
                borderBottomWidth: 1,
              }}>
              <View
                style={{
                  backgroundColor: Colors.grey,
                  padding: 8,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons size={24} name={'eye'} color={Colors.medium} />
              </View>
              <Text
                style={{
                  marginLeft: 16,
                  fontFamily: 'Inter-Semibold',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                Informations de la carte
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CardHistory', {card});
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomColor: Colors.border,
                borderBottomWidth: 1,
              }}>
              <View
                style={{
                  backgroundColor: Colors.grey,
                  padding: 8,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name={'bars'} color={Colors.medium} size={22} />
              </View>
              <Text
                style={{
                  marginLeft: 16,
                  fontFamily: 'Inter-Semibold',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                Relevé & transactions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RechargeCard', {card});
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomColor: Colors.border,
                borderBottomWidth: 1,
              }}>
              <View
                style={{
                  backgroundColor: Colors.grey,
                  padding: 8,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name={'arrow-bottom-left'}
                  color={Colors.medium}
                  size={22}
                />
              </View>

              <Text
                style={{
                  marginLeft: 16,
                  fontFamily: 'Inter-Semibold',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                Recharger la carte
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Withdrawal', {card});
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomColor: Colors.border,
                borderBottomWidth: 1,
              }}>
              <View
                style={{
                  backgroundColor: Colors.grey,
                  padding: 8,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name={'arrow-top-right'}
                  color={Colors.medium}
                  size={22}
                />
              </View>

              <Text
                style={{
                  marginLeft: 16,
                  fontFamily: 'Inter-Semibold',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                Retirer de l'argent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFreezeToggle}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomColor: Colors.border,
                borderBottomWidth: 1,
              }}>
              <View
                style={{
                  backgroundColor: Colors.grey,
                  padding: 8,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign
                  name={card.is_active ? 'pausecircleo' : 'playcircleo'}
                  color={Colors.medium}
                  size={22}
                />
              </View>

              <Text
                style={{
                  marginLeft: 16,
                  fontFamily: 'Inter-Semibold',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                {card.is_active
                  ? 'Désactiver la carte temporairement'
                  : 'Activer la carte'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                terminateConfirmRef.current?.open();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomColor: Colors.border,
                borderBottomWidth: 1,
              }}>
              <View
                style={{
                  backgroundColor: Colors.danger,
                  padding: 8,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name={'closecircleo'} color={'white'} size={22} />
              </View>

              <Text
                style={{
                  marginLeft: 16,
                  fontFamily: 'Inter-Semibold',
                  fontSize: 16,
                  color: Colors.danger,
                }}>
                Supprimer la carte
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <AsyncActionSheet
          ref={freezeActionRef}
          asyncAction={freezeCard}
          statusTexts={{
            loading: 'Un instant, la désactivation de ta carte est en cours...',
            error: "Oops, nous n'avons pas pu désactiver ta carte",
            success: 'Ta carte a été désactivée',
          }}
        />
        <AsyncActionSheet
          ref={unfreezeActionRef}
          asyncAction={unfreezeCard}
          statusTexts={{
            loading: "Un instant, l'activation de ta carte est en cours...",
            error: "Oops, nous n'avons pas pu activer ta carte",
            success: 'Ta carte a été activée',
          }}
        />
        <AsyncActionSheet
          ref={terminateActionRef}
          asyncAction={terminateCard}
          statusTexts={{
            loading: 'Un instant, la suppression de ta carte est en cours...',
            error: "Oops, nous n'avons pas pu supprimer ta carte",
            success: 'Ta carte a été supprimée',
          }}
        />
        <ConfirmSheet
          ref={terminateConfirmRef}
          confirmText={'Es-tu sûr de vouloir supprimer cette carte?'}
          onConfirm={() => {
            terminateConfirmRef.current?.close();
            terminateCard.execute().then(() => {
              setTimeout(() => navigation.goBack(), 1000);
            });
            terminateActionRef.current?.open();
          }}
          onCancel={() => {
            terminateConfirmRef.current?.close();
          }}
        />
      </>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingVertical: 32}}>
      <ActivityIndicator color={Colors.brand} />
    </View>
  );
}

export default CardDetail;
