import React from 'react';
import {isToday} from '../../utils';
import {Text, View} from 'react-native';
import Colors from '../../utils/colors';
import RequestItem from '../../components/RequestItem';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useInfinite} from '../../utils/hooks';
import InfiniteSectionList from '../../components/InfiniteSectionList';
import SectionHeader from '../../components/SectionHeader';

function Requests() {
  const requestsQuery = useInfinite(`/kash/requests/received/`, 10);

  const groups: any = requestsQuery.data?.reduce((groups: any, notif: any) => {
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
      <InfiniteSectionList
        query={requestsQuery}
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
        renderSectionHeader={({section}) => <SectionHeader section={section} />}
      />
    </View>
  );
}

export default Requests;
