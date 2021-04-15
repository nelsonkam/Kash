import {Text, TouchableOpacity, View} from 'react-native';
import Avatar from './Avatar';
import Colors from '../utils/colors';
import React from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const RequestItem = ({request}) => {
  const navigation = useNavigation();
  const profile = useSelector(state => state.auth.profile);
  const responded =
    request.responses.filter(r => r.sender === profile.kashtag).length > 0;
  const response = responded
    ? request.responses.filter(r => r.sender === profile.kashtag)[0]
    : null;
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ConfirmRequest', {request})}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
      }}>
      <Avatar profile={null} />
      <View style={{flex: 1, marginLeft: 12}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Semibold',
              fontSize: 16,
              color: Colors.dark,
            }}>
            {request.formatted?.title}
          </Text>
          {!responded && (
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
          {request.formatted?.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RequestItem;
