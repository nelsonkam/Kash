import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import Avatar from '../../components/Avatar';
import Colors from '../../utils/colors';
import Button from '../../components/Button';
import {useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

function ConfirmRequest() {
  const {params} = useRoute();
  const request = params.request;
  const navigation = useNavigation();
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
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: Colors.lightGrey,
            padding: 12,
            borderRadius: 8,
          }}>
          <Avatar profile={request.initiator} size={56} />
          <View style={{marginLeft: 12}}>
            <Text
              style={{
                color: Colors.dark,
                fontSize: 18,
                marginBottom: 6,
                fontFamily: 'Inter-Bold',
              }}>
              {request.initiator.name}
            </Text>
            <Text
              style={{
                color: Colors.medium,
                fontSize: 16,
                fontFamily: 'Inter-Bold',
              }}>
              ${request.initiator.kashtag}
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 36,
              color: Colors.dark,
              marginBottom: 24,
              textAlign: 'center',
            }}>
            CFA {request.amount}
          </Text>
          <View
            style={{
              borderColor: Colors.border,
              borderWidth: 2,
              padding: 12,
              borderRadius: 16,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: 18,
                color: Colors.dark,
              }}>
              "{request.note}"
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button
            style={{flex: 0.8}}
            onPress={() => navigation.goBack()}
            color={Colors.danger}>
            Ignorer
          </Button>
          <View style={{flex: 0.1}}></View>
          <Button
            onPress={() => navigation.navigate('Pay', request)}
            style={{flex: 0.8}}>
            Envoyer
          </Button>
        </View>
      </View>
      <View></View>
    </SafeAreaView>
  );
}

export default ConfirmRequest;
