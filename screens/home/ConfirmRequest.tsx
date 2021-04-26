import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import Avatar from '../../components/Avatar';
import Colors from '../../utils/colors';
import Button from '../../components/Button';
import {useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAsync} from '../../utils/hooks';
import api from '../../utils/api';

function ConfirmRequest() {
  const {params} = useRoute();
  // @ts-ignore
  const request = params.request;
  const navigation = useNavigation();
  const responded = request.accepted_at || request.rejected_at;
  const rejectRequest = useAsync(id =>
    api.post(`/kash/requests/${id}/rejected/`),
  );
  const handleReject = () => {
    rejectRequest.execute(request.id).then(res => {
      navigation.goBack();
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View
        style={{flexDirection: 'row', justifyContent: 'flex-end', padding: 16}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name={'close'} size={28} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: 0,
          padding: 16,
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View style={{alignItems: 'center'}}>
          <Avatar size={72} profile={request.initiator} />
          <Text style={{fontFamily: 'Inter-Bold', fontSize: 17, marginTop: 8}}>
            {request.initiator.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              color: Colors.medium,
              marginTop: 8,
              fontSize: 15,
            }}>
            ${request.initiator.kashtag}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 24,
            height: 270,
            justifyContent: 'space-between',
          }}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  marginRight: 6,
                  marginTop: 8,
                  fontFamily: 'Inter-Regular',
                  color: Colors.medium,
                }}>
                CFA
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: 42,
                  color: Colors.dark,
                }}>
                {parseFloat(request.amount).toLocaleString()}
              </Text>
            </View>
            <View
              style={{
                borderColor: Colors.border,
                borderWidth: 2,
                padding: 12,
                paddingHorizontal: 16,
                borderRadius: 16,
                marginTop: 24,
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  fontSize: 16,
                  color: Colors.dark,
                }}>
                "{request.note}"
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => null}
            style={{
              borderColor: Colors.danger,
              backgroundColor: 'white',
              borderWidth: 2,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 100,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 16,
                color: Colors.danger,
              }}>
              Bloquer cet utilisateur
            </Text>
          </TouchableOpacity>
        </View>
        {/*<View style={{alignItems: 'center'}}>*/}
        {/*  <Text*/}
        {/*    style={{*/}
        {/*      fontFamily: 'Inter-Semibold',*/}
        {/*      fontSize: 36,*/}
        {/*      color: Colors.dark,*/}
        {/*      marginBottom: 24,*/}
        {/*      textAlign: 'center',*/}
        {/*    }}>*/}
        {/*    CFA {request.amount}*/}
        {/*  </Text>*/}
        {/*  <View*/}
        {/*    style={{*/}
        {/*      borderColor: Colors.border,*/}
        {/*      borderWidth: 2,*/}
        {/*      padding: 12,*/}
        {/*      borderRadius: 16,*/}
        {/*    }}>*/}
        {/*    <Text*/}
        {/*      style={{*/}
        {/*        fontFamily: 'Inter-Medium',*/}
        {/*        fontSize: 18,*/}
        {/*        color: Colors.dark,*/}
        {/*      }}>*/}
        {/*      "{request.note}"*/}
        {/*    </Text>*/}
        {/*  </View>*/}
        {/*</View>*/}

        {!responded ? (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button
              style={{flex: 0.8}}
              onPress={handleReject}
              color={Colors.danger}
              loading={rejectRequest.loading}>
              Rejeter
            </Button>
            <View style={{flex: 0.1}} />
            <Button
              onPress={() => navigation.navigate('Pay', request)}
              style={{flex: 0.8}}>
              Accepter
            </Button>
          </View>
        ) : (
          <View style={{height: 100}} />
        )}
      </View>
      <View />
    </SafeAreaView>
  );
}

export default ConfirmRequest;
