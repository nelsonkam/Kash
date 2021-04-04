import React, {useEffect, useRef} from 'react';
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
import useSWR from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';
import KBottomSheet from '../../components/KBottomSheet';
import {isToday, spaceFour} from '../../utils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Clipboard from '@react-native-clipboard/clipboard';

const TransactionItem = ({transaction}) => {
  const isDebit = transaction.indicator === 'D';
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
          name={isDebit ? 'arrow-top-right' : 'arrow-bottom-left'}
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
            {transaction.narration || transaction.product}
          </Text>
          <Text
            style={{
              marginTop: 8,
              color: Colors.medium,
              fontFamily: 'Inter-Regular',
            }}>
            {new Date(transaction.created_at).toLocaleTimeString()} · Frais:{' '}
            {transaction.fee} {transaction.currency}
          </Text>
        </View>
        <Text
          style={{fontSize: 16, color: Colors.dark, fontFamily: 'Inter-Bold'}}>
          {transaction.currency} {transaction.amount}
        </Text>
      </View>
    </View>
  );
};

const CardDetailsHeader = ({onDetailClick}) => {
  const {params} = useRoute();
  const cardQuery = useSWR(`/kash/virtual-cards/${params.card.id}/`, fetcher);
  const card = cardQuery.data || params.card;

  return (
    <React.Fragment>
      <View
        style={{
          padding: 16,
          paddingBottom: 32,
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
        <Text style={{marginTop: 24, fontFamily: 'Inter-Bold', fontSize: 18}}>
          Transactions
        </Text>
      </View>
    </React.Fragment>
  );
};

function CardDetail() {
  const {params} = useRoute();
  const navigation = useNavigation();
  const cardQuery = useSWR(`/kash/virtual-cards/${params.card.id}/`, fetcher);
  const transactionsQuery = useSWR(
    `/kash/virtual-cards/${params.card.id}/transactions/`,
    fetcher,
  );
  const menuRef = useRef<KBottomSheet>(null);
  const detailsRef = useRef<KBottomSheet>(null);
  const card = cardQuery.data || params.card;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: card.nickname,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => menuRef.current.open()}
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

  if (transactionsQuery.data) {
    const groups = transactionsQuery.data.reduce((groups, txn) => {
      const date = txn.created_at.split('T')[0];
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
        data: groups[date],
      };
    });
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SectionList
          ListHeaderComponent={
            <CardDetailsHeader
              onDetailClick={() => detailsRef.current?.open()}
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
        <KBottomSheet ref={detailsRef} snapPoints={[200, 0]}>
          <View style={{backgroundColor: 'white', padding: 16, height: 200}}>
            <Text
              style={{fontFamily: 'Inter-Medium', fontSize: 18, marginTop: 16}}>
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
          </View>
        </KBottomSheet>
        <KBottomSheet ref={menuRef} snapPoints={[250, 0]}>
          <TouchableOpacity
            onPress={() => {
              menuRef.current.close();
              navigation.navigate('EditNickname', {card});
            }}
            style={{
              backgroundColor: 'white',
              padding: 16,
              paddingTop: 24,
              height: 250,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 12,
              }}>
              <AntDesign name={'edit'} color={Colors.medium} size={28} />
              <Text
                style={{
                  marginLeft: 16,
                  fontFamily: 'Inter-Medium',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                Changer le nom de la carte
              </Text>
            </View>
            <View
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
                  fontFamily: 'Inter-Medium',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                Recharger la carte
              </Text>
            </View>
            <View
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
                  fontFamily: 'Inter-Medium',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                Retirer de l'argent
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 12,
              }}>
              <AntDesign
                name={'closecircleo'}
                color={Colors.medium}
                size={28}
              />
              <Text
                style={{
                  marginLeft: 16,
                  fontFamily: 'Inter-Medium',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                Désactiver la carte
              </Text>
            </View>
          </TouchableOpacity>
        </KBottomSheet>
      </View>
    );
  }
  return <ActivityIndicator color={Colors.brand} />;
}

export default CardDetail;
