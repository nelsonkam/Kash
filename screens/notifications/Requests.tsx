import React, {useRef, useState} from 'react';
import {isToday} from '../../utils';
import {Text, View} from 'react-native';
import Colors from '../../utils/colors';
import RequestItem from '../../components/RequestItem';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAsync, useInfinite} from '../../utils/hooks';
import InfiniteSectionList from '../../components/InfiniteSectionList';
import SectionHeader from '../../components/SectionHeader';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import KBottomSheet from '../../components/KBottomSheet';
import api from '../../utils/api';
import {useNavigation} from '@react-navigation/native';

function Requests() {
  const navigation = useNavigation();

  const requestsQuery = useInfinite(`/kash/requests/received/`, 10);
  const rejectRequest = useAsync(id =>
    api.post(`/kash/requests/${id}/reject/`),
  );
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const requestConfirmRef = useRef<KBottomSheet>(null);

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
            <RequestItem
              onPress={request => {
                requestConfirmRef.current?.open();
                setCurrentRequest(request);
              }}
              request={item}
            />
          </View>
        )}
        renderSectionHeader={({section}) => <SectionHeader section={section} />}
      />
      <KBottomSheet ref={requestConfirmRef} snapPoints={[300, 0]}>
        {currentRequest && (
          <RequestConfirmSheet
            request={currentRequest}
            onConfirm={() => {
              requestConfirmRef.current?.close();
              navigation.navigate('PayKashRequest', {
                request: currentRequest,
              });
            }}
            onCancel={() => {
              requestConfirmRef.current?.close();
              rejectRequest
                .execute(currentRequest.id)
                .then(() => requestsQuery.refresh());
              setCurrentRequest(null);
            }}
          />
        )}
      </KBottomSheet>
    </View>
  );
}

type RequestConfirmSheetProps = {
  request: any;
  onConfirm: () => void;
  onCancel: () => void;
};
const RequestConfirmSheet = ({
  request,
  onConfirm,
  onCancel,
}: RequestConfirmSheetProps) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: 300,
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

export default Requests;
