import React from 'react';
import Notifications from '../notifications/Notifications';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ActivityIndicator, SectionList, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';
import {isToday} from '../../utils';
import {useRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialTopTabNavigator();
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

function Transactions() {
  const {params} = useRoute();
  const query = useSWRNative(
    `/kash/virtual-cards/${params.card.id}/transactions/`,
    fetcher,
  );

  if (!query.data) {
    return (
      <View style={{flex: 1, backgroundColor: 'white', paddingVertical: 32}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  const data = query.data.filter((item: any) => item.currency === 'USD');

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
          query.revalidate();
        }}
        refreshing={query.isValidating}
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
        renderItem={({item}) => (
          <TransactionItem key={item.id} transaction={item} />
        )}
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
            <View style={{height: 2, flex: 1, backgroundColor: Colors.brand}} />
          </View>
        )}
      />
    </View>
  );
}

function Statement() {
  const {params} = useRoute();
  const query = useSWRNative(
    `/kash/virtual-cards/${params.card.id}/statement/`,
    fetcher,
  );
  const data = query.data;

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
          query.revalidate();
        }}
        refreshing={query.isValidating}
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
            <View style={{height: 2, flex: 1, backgroundColor: Colors.brand}} />
          </View>
        )}
      />
    </View>
  );
}

function CardHistory() {
  const {params} = useRoute();
  return (
    <Tab.Navigator>
      <Tab.Screen initialParams={params} name="Relevé" component={Statement} />
      <Tab.Screen
        initialParams={params}
        name="Transactions"
        component={Transactions}
      />
    </Tab.Navigator>
  );
}

export default CardHistory;
