import React from 'react';
import {ActivityIndicator, SectionList, Text, View} from 'react-native';
import Colors from '../../utils/colors';
import useSWRNative from '@nandorojo/swr-react-native';
import {fetcher} from '../../utils/api';
import {isToday} from '../../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {RootState} from '../../utils/store';

const NotificationItem = ({notification}: {notification: any}) => {
  const {profile} = useSelector((s: RootState) => s.auth);

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
          backgroundColor: Colors.lightGrey,
        }}>
        <Text style={{fontSize: 18}}>💸</Text>
      </View>
      <View
        style={{
          marginLeft: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-Semibold',
                fontSize: 16,
                color: Colors.dark,
              }}>
              {notification.title}
            </Text>
          </View>
          <Text
            style={{
              marginTop: 4,
              color: Colors.medium,
              fontFamily: 'Inter-Regular',
            }}>
            {notification.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

function Notifications() {
  const notificationsQuery = useSWRNative(`/kash/notifications/`, fetcher);

  if (notificationsQuery.data) {
    const groups = notificationsQuery.data.reduce((groups: any, notif: any) => {
      const date = notif.created_at.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notif);
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
          onRefresh={() => notificationsQuery.revalidate()}
          refreshing={notificationsQuery.isValidating}
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
              <Ionicons
                name="notifications-circle"
                size={64}
                color={Colors.disabled}
              />
              <Text
                style={{
                  fontFamily: 'Inter-Semibold',
                  color: Colors.disabled,
                  marginTop: 16,
                }}>
                Tes notifs s'afficheront ici
              </Text>
            </View>
          )}
          contentContainerStyle={{paddingBottom: 16, backgroundColor: 'white'}}
          sections={sections}
          renderItem={({item}) => <NotificationItem notification={item} />}
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
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingVertical: 32}}>
      <ActivityIndicator color={Colors.brand} />
    </View>
  );
}

export default Notifications;
