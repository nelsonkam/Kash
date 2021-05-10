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

const TransactionItem = ({transaction}: {transaction: any}) => {
  const isDebit =
    transaction.indicator === 'D' ||
    transaction.type?.toLowerCase() === 'debit';
  let iconName = isDebit ? 'arrow-top-right' : 'arrow-bottom-left';
  iconName = transaction.status.toLowerCase() === 'failed' ? 'close' : iconName;
  return (
    <View style={{flexDirection: 'row', padding: 12, alignItems: 'center'}}>
      <View
        style={{
          height: 48,
          width: 48,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          backgroundColor: isDebit
            ? 'rgba(244, 84, 29, 0.05)'
            : 'rgba(26, 206, 76, 0.05)',
        }}>
        <MaterialCommunityIcons
          size={24}
          name={iconName}
          color={isDebit ? Colors.danger : Colors.success}
        />
      </View>
      <View
        style={{
          marginLeft: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
        }}>
        <View>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.dark,
            }}>
            {transaction.gateway_reference_details || transaction.merchant}
          </Text>
          {!!transaction.narration && (
            <Text
              style={{
                marginTop: 8,
                color: Colors.medium,
                fontFamily: 'Inter-Regular',
              }}>
              {transaction.narration || transaction.product}
            </Text>
          )}
        </View>
        <Text
          style={{fontSize: 16, color: Colors.dark, fontFamily: 'Inter-Bold'}}>
          $
          {(
            parseFloat(transaction.amount) + (transaction.fee || 0)
          ).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const CardDetailsHeader = ({
  card,
  onDetailClick,
  currentTab,
  onSwitchTab,
}: {
  card: any;
  currentTab: 'statement' | 'transactions';
  onDetailClick: () => void;
  onSwitchTab: (tab: 'statement' | 'transactions') => void;
}) => {
  return (
    <React.Fragment>
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
          paddingBottom: 16,
          backgroundColor: 'white',
        }}>
        <CreditCard card={card} />
        <View style={{marginVertical: 18, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={onDetailClick}
            style={{
              backgroundColor: Colors.brand,
              paddingHorizontal: 24,
              paddingVertical: 8,
              borderRadius: 90,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Ionicons size={24} name={'eye'} color={'white'} />
            <Text
              style={{
                color: 'white',
                fontFamily: 'Inter-Bold',
                fontSize: 16,
                marginLeft: 10,
              }}>
              Voir les infos
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: Colors.border,
            width: '100%',
            marginTop: 8,
          }}
        />
        <View
          style={{
            backgroundColor: Colors.lightGrey,
            borderRadius: 100,
            flexDirection: 'row',
            marginTop: 24,
          }}>
          <TouchableOpacity
            onPress={() => onSwitchTab('statement')}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 100,
              flex: 1,
              alignItems: 'center',
              backgroundColor:
                currentTab === 'statement' ? Colors.brand : Colors.lightGrey,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-Bold',
                fontSize: 16,
                color: currentTab === 'statement' ? 'white' : 'black',
              }}>
              Relevé
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSwitchTab('transactions')}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 100,
              flex: 1,
              alignItems: 'center',
              backgroundColor:
                currentTab === 'transactions' ? Colors.brand : Colors.lightGrey,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-Bold',
                fontSize: 16,
                color: currentTab === 'transactions' ? 'white' : 'black',
              }}>
              Transactions
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </React.Fragment>
  );
};

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
      headerRight: () => (
        <TouchableOpacity
          onPress={() => menuRef.current?.open()}
          style={{paddingHorizontal: 16}}>
          <Ionicons
            name={'ellipsis-horizontal'}
            color={Colors.brand}
            size={28}
          />
        </TouchableOpacity>
      ),
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
    const data =
      currentTab === 'transactions'
        ? transactionsQuery.data.filter((item: any) => item.currency === 'USD')
        : statementQuery.data;

    const groups = data.reduce((groups: any[], txn: any) => {
      const date = txn.created_at?.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(txn);
      return groups;
    }, {});

    const sections = Object.keys(groups).map(date => {
      return {
        title: isToday(new Date(date))
          ? "Aujourd'hui"
          : new Date(date).toLocaleDateString(),
        data: groups[date].sort((a: any, b: any) => {
          if (a.created_at > b.created_at) {
            return -1;
          } else if (a.created_at < b.created_at) {
            return 1;
          } else {
            return 0;
          }
        }),
      };
    });
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SectionList
          onRefresh={() => {
            cardQuery.revalidate();
            transactionsQuery.revalidate();
          }}
          refreshing={cardQuery.isValidating || transactionsQuery.isValidating}
          ListHeaderComponent={
            <CardDetailsHeader
              card={card}
              currentTab={currentTab}
              onDetailClick={() => detailsRef.current?.open()}
              onSwitchTab={tab => setTab(tab)}
            />
          }
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
              <AntDesign name="swap" size={64} color={Colors.disabled} />
              <Text
                style={{
                  fontFamily: 'Inter-Semibold',
                  color: Colors.disabled,
                  marginTop: 16,
                }}>
                Aucune transaction effectuée
              </Text>
            </View>
          )}
          contentContainerStyle={{paddingBottom: 16, backgroundColor: 'white'}}
          sections={sections}
          renderItem={({item}) => <TransactionItem transaction={item} />}
          renderSectionHeader={({section}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 16,
              }}>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 50,
                  backgroundColor: Colors.brand,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Inter-Semibold',
                    fontSize: 16,
                    textTransform: 'uppercase',
                  }}>
                  {section.title}
                </Text>
              </View>
              <View
                style={{height: 2, flex: 1, backgroundColor: Colors.brand}}
              />
            </View>
          )}
        />
        <KBottomSheet ref={detailsRef} snapPoints={[280, 0]}>
          <View style={{backgroundColor: 'white', padding: 16, height: 320}}>
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                fontSize: 18,
                marginTop: 16,
              }}>
              {card.card_details.name_on_card}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 12,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: 'Inter-Semibold',
                  marginRight: 18,
                }}>
                {spaceFour(card.card_details.card_pan)}
              </Text>
              <TouchableOpacity
                onPress={() => Clipboard.setString(card.card_details.card_pan)}>
                <Ionicons
                  name={'copy-outline'}
                  size={28}
                  color={Colors.brand}
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <View style={{marginRight: 48}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Inter-Semibold',
                    color: Colors.medium,
                  }}>
                  EXP
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Inter-Semibold',
                    color: Colors.dark,
                    marginTop: 4,
                  }}>
                  {card.card_details.expiration.split('-')[1]}/
                  {card.card_details.expiration.split('-')[0]}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Inter-Semibold',
                    color: Colors.medium,
                  }}>
                  CVV
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Inter-Semibold',
                    color: Colors.dark,
                    marginTop: 4,
                  }}>
                  {card.card_details.cvv || card.card_details.cvc}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <View style={{marginRight: 48}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Inter-Semibold',
                    color: Colors.medium,
                  }}>
                  Adresse de facturation
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Inter-Semibold',
                    color: Colors.dark,
                    marginTop: 8,
                  }}>
                  {card.card_details.address_1}, {card.card_details.city},{' '}
                  {card.card_details.state}, {card.card_details.zip_code}
                </Text>
              </View>
            </View>
          </View>
        </KBottomSheet>
        <KBottomSheet ref={menuRef} snapPoints={[300, 0]}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 16,
              paddingTop: 24,
              height: 300,
            }}>
            <TouchableOpacity
              onPress={() => {
                menuRef.current?.close();
                navigation.navigate('EditNickname', {card});
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 12,
              }}>
              <AntDesign name={'edit'} color={Colors.medium} size={28} />
              <Text
                style={{
                  marginLeft: 16,
                  fontFamily: 'Inter-Semibold',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                Changer le nom de la carte
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                menuRef.current?.close();
                navigation.navigate('RechargeCard', {card});
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 12,
              }}>
              <MaterialCommunityIcons
                name={'arrow-bottom-left'}
                color={Colors.medium}
                size={28}
              />
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
                menuRef.current?.close();
                navigation.navigate('Withdrawal', {card});
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 12,
              }}>
              <MaterialCommunityIcons
                name={'arrow-top-right'}
                color={Colors.medium}
                size={28}
              />
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
                marginVertical: 12,
              }}>
              <AntDesign
                name={card.is_active ? 'pausecircleo' : 'playcircleo'}
                color={Colors.medium}
                size={28}
              />
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
                menuRef.current?.close();
                terminateConfirmRef.current?.open();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 12,
              }}>
              <AntDesign
                name={'closecircleo'}
                color={Colors.danger}
                size={28}
              />
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
        </KBottomSheet>
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
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingVertical: 32}}>
      <ActivityIndicator color={Colors.brand} />
    </View>
  );
}

export default CardDetail;
