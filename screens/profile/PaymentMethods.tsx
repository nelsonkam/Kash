import React, {useRef} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import useSWRNative from '@nandorojo/swr-react-native';
import api, {fetcher} from '../../utils/api';
import Colors from '../../utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAsync} from '../../utils/hooks';
import AsyncActionSheet from '../../components/AsyncActionSheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

function PaymentMethods(props) {
  const navigation = useNavigation();
  const payoutMethods = useSWRNative(`/kash/momo-accounts/`, fetcher);
  const actionRef = useRef(null);
  const deletePayoutMethod = useAsync(id =>
    api.delete(`/kash/momo-accounts/${id}/`),
  );
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddPaymentMethod')}
          style={{paddingHorizontal: 16}}>
          <Ionicons name={'add-circle'} color={Colors.brand} size={28} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const data = payoutMethods.data;
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 16,
              paddingRight: 16,
              marginLeft: 16,
              borderBottomColor: Colors.border,
              borderBottomWidth: 1,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {item.gateway === 'mtn-bj' && (
                <Image
                  source={require('../../assets/mtn.png')}
                  style={{height: 32, width: 32, borderRadius: 2}}
                />
              )}
              {item.gateway === 'moov-bj' && (
                <Image
                  source={require('../../assets/moov-africa.jpeg')}
                  style={{height: 32, width: 32, borderRadius: 2}}
                />
              )}
              <Text
                style={{
                  fontFamily: 'Inter-Semibold',
                  color: Colors.dark,
                  fontSize: 16,
                  marginLeft: 12,
                }}>
                {item.phone}
              </Text>
            </View>
            {data.length > 1 && (
              <TouchableOpacity
                onPress={() => {
                  actionRef.current?.open();
                  deletePayoutMethod.execute(item.id).then(() => {
                    setTimeout(() => {
                      actionRef.current?.close();
                    }, 1000);
                  });
                }}>
                <AntDesign name={'delete'} color={Colors.danger} size={20} />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      <AsyncActionSheet
        ref={actionRef}
        asyncAction={deletePayoutMethod}
        statusTexts={{
          loading: 'Traitement en cours...',
          error: "Oops, nous n'avons pas pu retirer ton compte momo de l'appli",
          success: "Ton compte momo a été retiré de l'appli",
        }}
      />
    </View>
  );
}

export default PaymentMethods;
