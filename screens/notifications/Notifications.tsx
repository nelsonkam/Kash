import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../utils/colors';
import useSWRNative from '@nandorojo/swr-react-native';
import api, {fetcher} from '../../utils/api';
import {isToday} from '../../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import KBottomSheet from '../../components/KBottomSheet';
import {useSelector} from 'react-redux';
import {RootState} from '../../utils/store';
import {useAsync} from '../../utils/hooks';
import {useNavigation} from '@react-navigation/native';

const NotificationItem = ({notification, onPress}) => {
  const {profile} = useSelector((s: RootState) => s.auth);
  const isRequest = notification.content_object.type === 'request';
  const responded =
    isRequest &&
    notification.content_object.responses.filter(
      r => r.sender === profile.kashtag,
    ).length > 0;
  const response = responded
    ? notification.content_object.responses.filter(
        r => r.sender === profile.kashtag,
      )[0]
    : null;
  const canAccept = isRequest && !responded;
  return (
    <TouchableOpacity
      onPress={() => canAccept && onPress(notification.content_object)}
      activeOpacity={canAccept ? 0.4 : 1}
      style={{flexDirection: 'row', padding: 12, alignItems: 'center'}}>
      {isRequest && notification.content_object.initiator ? (
        <Avatar size={48} profile={notification.content_object.initiator} />
      ) : (
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
      )}
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
            {canAccept && (
              <Text
                style={{
                  color: Colors.medium,
                  fontSize: 15,
                  fontFamily: 'Inter-Bold',
                }}>
                <Text style={{color: Colors.brand}}>Accepter</Text> /{' '}
                <Text style={{color: Colors.danger}}>Refuser</Text>
              </Text>
            )}
            {responded && (
              <View
                style={{
                  backgroundColor: response.accepted
                    ? Colors.lightSuccess
                    : Colors.lightDanger,
                  padding: 4,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                }}>
                <Text
                  style={{
                    fontFamily: 'Inter-Semibold',
                    color: response.accepted ? Colors.brand : Colors.danger,
                  }}>
                  {response.accepted ? 'Accepté' : 'Refusé'}
                </Text>
              </View>
            )}
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
    </TouchableOpacity>
  );
};

const RequestConfirmSheet = ({request, onConfirm, onCancel}) => {
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
        <View>
          <Avatar profile={request.initiator} size={64} />
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Inter-Semibold',
            color: Colors.dark,
            fontSize: 18,
            textAlign: 'center',
          }}>
          ${request.initiator.kashtag} a besoin de CFA {request.amount} pour "
          {request.note}"
        </Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button style={{flex: 0.8}} onPress={onCancel} color={Colors.danger}>
          Ignorer
        </Button>
        <View style={{flex: 0.1}}></View>
        <Button onPress={onConfirm} style={{flex: 0.8}}>
          Envoyer
        </Button>
      </View>
    </View>
  );
};

function Notifications(props) {
  const navigation = useNavigation();
  const notificationsQuery = useSWRNative(`/kash/notifications/`, fetcher);
  const rejectRequest = useAsync(id =>
    api.post(`/kash/requests/${id}/rejected/`),
  );
  const [currentRequest, setCurrentRequest] = useState(null);
  const requestConfirmRef = useRef<KBottomSheet>(null);
  if (notificationsQuery.data) {
    const groups = notificationsQuery.data.reduce((groups, notif) => {
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
          renderItem={({item}) => (
            <NotificationItem
              onPress={request => {
                requestConfirmRef.current?.open();
                setCurrentRequest(request);
              }}
              notification={item}
            />
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
              <View
                style={{height: 2, flex: 1, backgroundColor: Colors.brand}}
              />
            </View>
          )}
        />
        <KBottomSheet ref={requestConfirmRef} snapPoints={[320, 0]}>
          {currentRequest && (
            <RequestConfirmSheet
              request={currentRequest}
              onConfirm={() => {
                requestConfirmRef.current?.close();
                navigation.navigate('SendRequestKash', {
                  request: currentRequest,
                });
              }}
              onCancel={() => {
                requestConfirmRef.current?.close();
                rejectRequest
                  .execute(currentRequest.id)
                  .then(() => notificationsQuery.mutate());
                setCurrentRequest(null);
              }}
            />
          )}
        </KBottomSheet>
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
