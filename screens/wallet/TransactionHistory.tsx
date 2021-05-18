import {SectionList, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {isToday} from '../../utils';
import TransactionItem from '../../components/TransactionItem';
import {useInfinite} from '../../utils/hooks';
import InfiniteSectionList from '../../components/InfiniteSectionList';
import SectionHeader from '../../components/SectionHeader';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';

function TransactionHistory() {
  const transactionsQuery = useSWRNative(
    `/kash/wallets/current/transactions/`,
    fetcher,
  );

  const groups = transactionsQuery.data?.reduce(
    (groups: any, transaction: any) => {
      const date = transaction.created_at.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {},
  );

  const sections = Object.keys(groups || {}).map(date => {
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
        onRefresh={() => transactionsQuery.revalidate()}
        refreshing={transactionsQuery.isValidating}
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
              Tes transactions s'afficheront ici
            </Text>
          </View>
        )}
        contentContainerStyle={{paddingBottom: 16, backgroundColor: 'white'}}
        sections={sections}
        renderItem={({item}) => (
          <View style={{paddingHorizontal: 16, paddingVertical: 8}}>
            <TransactionItem transaction={item} />
          </View>
        )}
        renderSectionHeader={({section}) => <SectionHeader section={section} />}
      />
    </View>
  );
}

export default TransactionHistory;