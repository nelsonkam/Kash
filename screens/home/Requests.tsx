import React from 'react';
import {isToday} from '../../utils';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';
import {SectionList, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KBottomSheet from '../../components/KBottomSheet';
import RequestItem from '../../components/RequestItem';
import AntDesign from 'react-native-vector-icons/AntDesign';

function Requests(props) {
  const requestsQuery = useSWRNative(
    `/kash/requests/received/?paginate=1`,
    fetcher,
  );

  const groups = requestsQuery.data?.results?.reduce((groups, notif) => {
    const date = notif.created_at.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notif);
    return groups;
  }, {});

  const sections = Object.keys(groups || {}).map(date => {
    return {
      title: isToday(new Date(date))
        ? "Aujourd'hui"
        : new Date(date).toLocaleDateString(),
      data: groups[date].sort((a, b) => {
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
        onRefresh={() => requestsQuery.revalidate()}
        refreshing={requestsQuery.isValidating}
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
            <AntDesign name="arrowdown" size={64} color={Colors.disabled} />
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                color: Colors.disabled,
                marginTop: 16,
              }}>
              Tes requêtes s'afficheront ici
            </Text>
          </View>
        )}
        contentContainerStyle={{paddingBottom: 16, backgroundColor: 'white'}}
        sections={sections}
        renderItem={({item}) => (
          <View style={{paddingHorizontal: 16}}>
            <RequestItem request={item} />
          </View>
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

export default Requests;
